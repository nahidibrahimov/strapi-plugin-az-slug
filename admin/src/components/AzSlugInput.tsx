import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Field, Flex, TextInput, Typography } from '@strapi/design-system';
import {
  unstable_useContentManagerContext as useContentManagerContext,
  useFetchClient,
} from '@strapi/strapi/admin';
import { ArrowClockwise } from '@strapi/icons';
import slugifyAz from "../utils/slugifyAz";

type Props = {
  name: string;
  value?: string;
  onChange: (e: {
    target: {
      name: string;
      value: string;
      type: string;
    };
  }) => void;
  attribute?: any;
  disabled?: boolean;
  error?: string;
  hint?: string;
  required?: boolean;
  intlLabel?: {
    defaultMessage?: string;
  };
};

type SlugStatus = 'idle' | 'checking' | 'ok' | 'taken';

const AzSlugInput = (props: Props) => {
  const {
    name,
    value = '',
    onChange,
    attribute,
    disabled = false,
    error,
    hint,
    required,
    intlLabel,
  } = props;

  const { get } = useFetchClient();
  const { id, contentType, model, form } = useContentManagerContext() as any;

  const [manual, setManual] = useState(false);
  const [status, setStatus] = useState<SlugStatus>('idle');
  const latestReq = useRef(0);

  const targetField = attribute?.options?.targetField || 'title';
  const titleValue = form?.values?.[targetField] || '';
  const generated = useMemo(() => slugifyAz(titleValue), [titleValue]);

  useEffect(() => {
    if (!manual && generated && value !== generated) {
      onChange({
        target: {
          name,
          value: generated,
          type: 'string',
        },
      });
    }
  }, [generated, manual, value, name, onChange]);

  useEffect(() => {
    if (!value) {
      setStatus('idle');
      return;
    }

    const reqId = ++latestReq.current;
    setStatus('checking');

    const timeout = setTimeout(async () => {
      try {
        const params = new URLSearchParams({
          field: name.split('.').pop() || name,
          value,
          contentType: model,
          documentId: id,
        });

        const res = await get(`/strapi-plugin-az-slug/slug/check?${params.toString()}`);

        const data = res.data;

        if (reqId !== latestReq.current) return;

        setStatus(data.available ? 'ok' : 'taken');
      } catch {
        if (reqId !== latestReq.current) return;
        setStatus('idle');
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [value, get, model, name]);

  function getStatusInfo(): [string, string] {
    switch (status) {
      case 'ok':
        return ['Available', 'success600'];
      case 'taken':
        return ['Already exists', 'danger600'];
      default:
        return [hint || '', 'neutral600'];
    }
  }

  const [statusText, statusColor] = getStatusInfo();

  return (
    <Field.Root name={name} error={error} required={required}>
      <Flex direction="column" alignItems="stretch" gap={1}>
        <Field.Label>{intlLabel?.defaultMessage || name}</Field.Label>
        <TextInput
          type="text"
          name={name}
          value={value}
          disabled={disabled}
          hasError={Boolean(error || status === 'taken')}
          required={required}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setManual(true);
            onChange({
              target: {
                name,
                value: e.target.value,
                type: 'string',
              },
            });
          }}
          endAction={
            <Button
              gap={0}
              type="button"
              variant="secondary"
              size="S"
              loading={status == 'checking'}
              disabled={disabled || !titleValue || !manual}
              startIcon={<ArrowClockwise />}
              onClick={() => {
                const nextValue = slugifyAz(titleValue);
                setManual(false);
                onChange({
                  target: {
                    name,
                    value: nextValue,
                    type: 'string',
                  },
                });
              }}
            ></Button>
          }
        />

        {(error || statusText) && (
          <Typography variant="pi" textColor={error ? 'danger600' : statusColor}>
            {error || statusText}
          </Typography>
        )}
      </Flex>
    </Field.Root>
  );
};

export default AzSlugInput;
