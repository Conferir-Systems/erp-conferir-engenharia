import { z } from 'zod'

export const nameValidator = (value: string, fieldName: string) => {
	const trimmed = value.trim()

	if (trimmed.length === 0) {
		return `O campo ${fieldName} é obrigatório`
	}

	if (trimmed.length < 2) {
		return `O ${fieldName} deve ter pelo menos 2 caracteres`
	}

	if (trimmed.length > 50) {
		return `O ${fieldName} deve ter no máximo 50 caracteres`
	}

	if (/\d/.test(trimmed)) {
		return `O ${fieldName} não pode conter números`
	}

	if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(trimmed)) {
		return `O ${fieldName} contém caracteres inválidos`
	}

	if (trimmed.length !== trimmed.replace(/\s+/g, ' ').length) {
		return `O ${fieldName} não pode ter espaços múltiplos`
	}

	return true
}

export const emailValidator = (value: string) => {
	const trimmed = value.trim()

	if (trimmed.length === 0) {
		return 'O campo E-mail é obrigatório'
	}

	if (trimmed.length > 100) {
		return 'O e-mail deve ter no máximo 100 caracteres'
	}

	if (trimmed.includes("'") || trimmed.includes('"') || trimmed.includes('`')) {
		return 'E-mail inválido: não pode conter aspas'
	}

	const dangerousChars = /[<>\\;()[\]{}|~!#$%^&*=+]/
	if (dangerousChars.test(trimmed)) {
		return 'E-mail inválido: contém caracteres não permitidos'
	}

	if (/\s/.test(trimmed)) {
		return 'E-mail inválido: não pode conter espaços'
	}

	const strictEmailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
	if (!strictEmailRegex.test(trimmed)) {
		return 'Formato de e-mail inválido. Use o formato: exemplo@dominio.com'
	}

	if (trimmed.includes('..')) {
		return 'E-mail inválido: não pode conter pontos consecutivos'
	}

	if (trimmed.startsWith('.') || trimmed.endsWith('.')) {
		return 'E-mail inválido: não pode começar ou terminar com ponto'
	}

	const [localPart, domain] = trimmed.split('@')

	if (localPart.length === 0) {
		return 'E-mail inválido: parte antes do @ não pode estar vazia'
	}

	if (localPart.startsWith('.') || localPart.endsWith('.')) {
		return 'E-mail inválido: parte local não pode começar ou terminar com ponto'
	}

	if (localPart.startsWith('-') || localPart.endsWith('-')) {
		return 'E-mail inválido: parte local não pode começar ou terminar com hífen'
	}

	if (domain.length === 0 || !domain.includes('.')) {
		return 'E-mail inválido: domínio incompleto'
	}

	if (domain.startsWith('.') || domain.endsWith('.')) {
		return 'E-mail inválido: domínio não pode começar ou terminar com ponto'
	}

	if (domain.startsWith('-') || domain.endsWith('-')) {
		return 'E-mail inválido: domínio não pode começar ou terminar com hífen'
	}

	const domainParts = domain.split('.')
	if (domainParts.some((part) => part.length === 0)) {
		return 'E-mail inválido: domínio mal formatado'
	}

	const domainRegex = /^[a-zA-Z0-9-]+$/
	if (domainParts.some((part) => !domainRegex.test(part))) {
		return 'E-mail inválido: domínio contém caracteres inválidos'
	}

	const tld = domainParts[domainParts.length - 1]
	if (tld.length < 2) {
		return 'E-mail inválido: extensão do domínio muito curta'
	}

	return true
}

export const passwordValidator = (value: string) => {
	if (value.length === 0) {
		return 'O campo Senha é obrigatório'
	}

	if (value.length < 8) {
		return 'A senha deve ter pelo menos 8 caracteres'
	}

	if (value.length > 100) {
		return 'A senha deve ter no máximo 100 caracteres'
	}

	if (!/[a-z]/.test(value)) {
		return 'A senha deve conter pelo menos uma letra minúscula'
	}

	if (!/[A-Z]/.test(value)) {
		return 'A senha deve conter pelo menos uma letra maiúscula'
	}

	if (!/\d/.test(value)) {
		return 'A senha deve conter pelo menos um número'
	}

	if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value)) {
		return 'A senha deve conter pelo menos um caractere especial (!@#$%^&* etc.)'
	}

	if (/\s/.test(value)) {
		return 'A senha não pode conter espaços'
	}

	return true
}

export const registerSchema = z
	.object({
		firstName: z.string().superRefine((val, ctx) => {
			const result = nameValidator(val.trim(), 'nome')
			if (result !== true) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: result,
				})
			}
		}),
		lastName: z.string().superRefine((val, ctx) => {
			const result = nameValidator(val.trim(), 'sobrenome')
			if (result !== true) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: result,
				})
			}
		}),
		email: z.string().superRefine((val, ctx) => {
			const result = emailValidator(val.trim())
			if (result !== true) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: result,
				})
			}
		}),
		password: z.string().superRefine((val, ctx) => {
			const result = passwordValidator(val)
			if (result !== true) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: result,
				})
			}
		}),
		confirmPassword: z.string().min(1, 'A confirmação de senha é obrigatória'),
		userType: z.string().min(1, 'O campo Tipo de Usuário é obrigatório'),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'As senhas não coincidem',
		path: ['confirmPassword'],
	})

export type RegisterFormData = z.infer<typeof registerSchema>
