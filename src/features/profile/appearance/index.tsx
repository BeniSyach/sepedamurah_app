import { ContentSection } from '../components/content-section'
import { AppearanceForm } from './appearance-form'

export function SettingsAppearance() {
  return (
    <ContentSection
      title='Tampilan'
      desc='Sesuaikan tampilan aplikasi. Tema siang dan malam akan berganti secara otomatis.'
    >
      <AppearanceForm />
    </ContentSection>
  )
}
