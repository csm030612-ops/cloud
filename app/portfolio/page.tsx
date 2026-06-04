import { createClient } from '@/lib/supabase/server'
import { getPortfolios, getMyProfile } from '@/lib/actions'
import Navbar from '@/components/Navbar'
import PortfolioCard from '@/components/PortfolioCard'
import Link from 'next/link'

export const revalidate = 0

export default async function PortfolioPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: portfolios }, profile] = await Promise.all([
    getPortfolios(),
    user ? getMyProfile() : Promise.resolve(null),
  ])

  // ⭕ 관리자 이메일인지 체크하는 기준 (본인 이메일로 변경하세요!)
  const isAdmin = user?.email === 'csm030612@naver.com'

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* ⭕ 1. 냅바에 email={user?.email}을 정상적으로 배달해줍니다. */}
      <Navbar isLoggedIn={!!user} nickname={profile?.nickname} email={user?.email} />

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px' }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          marginBottom: 40, flexWrap: 'wrap', gap: 16,
        }}>
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'var(--primary-light)', color: 'var(--primary)',
              fontSize: 12, fontWeight: 600, padding: '4px 12px',
              borderRadius: 20, marginBottom: 10,
            }}>
              ✦ 포트폴리오 갤러리
            </div>
            <h1 style={{ fontSize: 36, fontWeight: 800, color: 'var(--text)', margin: '0 0 8px', letterSpacing: '-0.5px' }}>
              최소명의 포트폴리오 🎨
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 15, margin: 0 }}>
              {portfolios.length}개의 멋진 프로젝트가 공유되어 있어요
            </p>
          </div>

          {/* ⭕ 2. 냅바뿐만 아니라 화면 우측 상단의 등록 버튼도 관리자에게만 노출 */}
          {isAdmin && (
            <Link href="/portfolio/new" style={{
              textDecoration: 'none',
              background: 'linear-gradient(135deg, var(--primary), #a78bfa)',
              color: '#fff', fontWeight: 700, fontSize: 15,
              padding: '14px 28px', borderRadius: 14,
              display: 'flex', alignItems: 'center', gap: 8,
              boxShadow: '0 4px 16px rgba(124,58,237,0.3)',
            }}>
              <span style={{ fontSize: 18 }}>+</span> 내 포트폴리오 등록
            </Link>
          )}
        </div>

        {portfolios.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '80px 40px',
            background: 'var(--surface)', borderRadius: 20,
            border: '2px dashed var(--border)',
          }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🌱</div>
            <h3 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', margin: '0 0 8px' }}>
              아직 포트폴리오가 없어요
            </h3>
            <p style={{ color: 'var(--text-muted)', margin: '0 0 24px' }}>
              첫번째로 포트폴리오를 등록해보세요!
            </p>
            {/* ⭕ 3. 게시글이 아예 없을 때 뜨는 안내창의 버튼도 관리자 여부에 따라 주소 분기 */}
            {isAdmin ? (
              <Link href="/portfolio/new" style={{
                textDecoration: 'none', background: 'var(--primary)', color: '#fff',
                fontWeight: 600, padding: '12px 24px', borderRadius: 12,
              }}>
                지금 작성하기 →
              </Link>
            ) : user ? (
              <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>관리자만 포트폴리오를 등록할 수 있습니다.</span>
            ) : (
              <Link href="/" style={{
                textDecoration: 'none', background: 'var(--primary)', color: '#fff',
                fontWeight: 600, padding: '12px 24px', borderRadius: 12,
              }}>
                로그인하고 시작하기 →
              </Link>
            )}
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 20,
          }}>
            {portfolios.map(p => (
              <PortfolioCard key={p.id} portfolio={p} currentUserId={user?.id} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
