export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  allowedValues?: string[]
}

export interface ValidationRules {
  title: ValidationRule
  description: ValidationRule
  priority: ValidationRule
}

export interface ValidationResult {
  valid: boolean
  errors: Record<string, string>
}