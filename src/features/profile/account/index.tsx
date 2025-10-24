import { ContentSection } from '../components/content-section'
import { AccountForm } from './account-form'

export function SettingsAccount() {
  return (
    <ContentSection
      title='Akun'
      desc='Perbarui pengaturan akun Anda. Atur foto dan Visual TTE yang diinginkan.'
    >
      <AccountForm />
    </ContentSection>
  )
}
