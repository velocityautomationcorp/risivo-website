/**
 * Button Component
 * Reusable button with different variants and sizes
 */

export interface ButtonProps {
  text: string
  href?: string
  variant?: 'primary' | 'secondary' | 'outline' | 'text'
  size?: 'sm' | 'md' | 'lg'
  icon?: string
  onClick?: string
  disabled?: boolean
  type?: 'button' | 'submit'
}

export function Button({
  text,
  href,
  variant = 'primary',
  size = 'md',
  icon,
  onClick,
  disabled = false,
  type = 'button',
}: ButtonProps): string {
  const classes = `btn btn-${variant} btn-${size}`
  
  if (href) {
    return `
      <a href="${href}" class="${classes}" ${disabled ? 'aria-disabled="true"' : ''}>
        ${icon ? `<span class="icon">${icon}</span>` : ''}
        <span>${text}</span>
      </a>
    `
  }
  
  return `
    <button 
      type="${type}"
      class="${classes}"
      ${disabled ? 'disabled' : ''}
      ${onClick ? `onclick="${onClick}"` : ''}
    >
      ${icon ? `<span class="icon">${icon}</span>` : ''}
      <span>${text}</span>
    </button>
  `
}
