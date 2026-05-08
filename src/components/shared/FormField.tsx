import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

import { Label } from '../ui/label'
import { Input } from '../ui/input'

interface FormFieldProps {
  id: string
  label: string
  type?: string
  placeholder?: string
  value: string
  onChange: (v: string) => void
  error?: string
}

export function FormField({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
}: FormFieldProps) {
  const [showPassword, setShowPassword] = useState(false)

  const isPasswordField = type === 'password'

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>

      <div className="relative">
        <Input
          id={id}
          type={
            isPasswordField && showPassword
              ? 'text'
              : type
          }
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`pr-10 ${
            error
              ? 'border-destructive focus-visible:ring-destructive'
              : ''
          }`}
        />

        {isPasswordField && (
          <button
            type="button"
            onClick={() =>
              setShowPassword((prev) => !prev)
            }
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        )}
      </div>

      {error && (
        <p className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}