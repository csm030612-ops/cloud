import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AuthForm from '@/components/AuthForm'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) redirect('/portfolio')

  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8f5ff 0%, #ede9fe 50%, #f0f9ff 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px 20px', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: -100, right: -100, width: 400, height: 400,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(167,139,250,0.2) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: -80, left: -80, width: 300, height: 300,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: 40, width: '100%', maxWidth: 900,
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'var(--primary-light)', color: 'var(--primary)',
            fontSize: 13, fontWeight: 600, padding: '6px 16px',
            borderRadius: 20, marginBottom: 20,
          }}>
            ✦ Portfolio Hub에 오신걸 환영해요
          </div>
          <h1 style={{
            fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800,
            color: 'var(--text)', margin: '0 0 16px',
            lineHeight: 1.2, letterSpacing: '-1px',
          }}>
            나만의 포트폴리오를<br />
            <span style={{ color: 'var(--primary)' }}>세상에 공유</span>해보세요
          </h1>
          <p style={{ fontSize: 18, color: 'var(--text-muted)', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
            닉네임으로 활동하는 개발자 포트폴리오 공유 플랫폼
          </p>
        </div>

        <AuthForm />

        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
          {['✏️ 쉽게 작성', '🏷️ 닉네임으로 활동', '🌐 모두와 공유', '🗑 내 글 관리'].map(f => (
            <div key={f} style={{
              background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.9)',
              borderRadius: 12, padding: '10px 20px',
              fontSize: 14, fontWeight: 600, color: 'var(--text)',
            }}>{f}</div>
          ))}
        </div>
      </div>
    </main>
  )
}
