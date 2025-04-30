import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { parsePhoneNumberFromString, AsYouType, CountryCode } from 'libphonenumber-js';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  defaultCountry?: CountryCode;
}

export function PhoneNumberInput({
  value,
  onChange,
  disabled = false,
  className = '',
  placeholder = '+1 (555) 123-4567',
  defaultCountry = 'US' as CountryCode,
}: PhoneInputProps) {
  const [inputValue, setInputValue] = useState(value);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (value !== inputValue && !value.includes(inputValue)) {
      setInputValue(value);

      if (value) {
        const phoneNumber = parsePhoneNumberFromString(value, defaultCountry);
        setIsValid(!!phoneNumber?.isValid());
      }
    }
  }, [value, inputValue, defaultCountry]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    const formatter = new AsYouType();
    const formattedValue = formatter.input(newValue);
    setInputValue(formattedValue);

    const phoneNumber = parsePhoneNumberFromString(formattedValue, defaultCountry);
    const valid = !!phoneNumber?.isValid();
    setIsValid(valid);

    onChange(formattedValue);
  };

  return (
    <Input
      type="tel"
      value={inputValue}
      onChange={handleChange}
      disabled={disabled}
      className={`${className} ${isValid && inputValue.length > 5 ? 'border-gray-500' : ''}`}
      placeholder={placeholder}
    />
  );
}
