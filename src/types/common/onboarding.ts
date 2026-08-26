/**
 * Tenant Onboarding Types
 */

export type Step = 1 | 2 | 3 | 'welcome' | 'store-name' | 'subdomain' | 'customization' | 'review' | 'success';

export type ValidationStatus = 'idle' | 'typing' | 'checking' | 'available' | 'taken' | 'invalid' | 'error';

export type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';
