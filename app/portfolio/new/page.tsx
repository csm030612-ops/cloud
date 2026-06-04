import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getMyProfile } from '@/lib/actions'
import Navbar from '@/components/Navbar'
import PortfolioForm from '@/components/PortfolioForm'

export default async function NewPortfolioPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/')

  const profile = await getMyProfile()

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar isLoggedIn={true} nickname={profile?.nickname} />

      <main style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ marginBottom: 36 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'var(--primary-light)', color: 'var(--primary)',
            fontSize: 12, fontWeight: 600, padding: '4px 12px',
            borderRadius: 20, marginBottom: 12,
          }}>
            ✦ 새 포트폴리오
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: 'var(--text)', margin: '0 0 8px', letterSpacing: '-0.5px' }}>
            프로젝트를 소개해주세요 ✨
          </h1>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: 15 }}>
            <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{profile?.nickname}</span>님의 멋진 작품을 공유해보세요!
          </p>
        </div>

        <div style={{
          background: 'var(--surface)', borderRadius: 20,
          boxShadow: 'var(--shadow-md)', padding: '36px',
          border: '1px solid var(--border)',
        }}>
          <PortfolioForm />
        </div>
      </main>
    </div>
  )
}
