import { ContentSection } from '../components/content-section'
import { ProfileForm } from './profile-form'

export function SettingsProfile() {
  return (
    <ContentSection
      title='Profil'
      desc='Inilah tampilan Anda yang akan terlihat oleh pengguna lain di situs ini.'
    >
      <ProfileForm />
    </ContentSection>
  )
}
