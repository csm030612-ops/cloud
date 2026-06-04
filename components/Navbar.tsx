'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signOut } from '@/lib/actions'

type Props = {
  nickname?: string | null
  isLoggedIn: boolean
  email?: string | null // ⭕ 1. Props 타입에 이메일 추가!
}

export default function Navbar({ nickname, isLoggedIn, email }: Props) { // ⭕ 2. email 구조분해할당으로 받기
  const [loading, setLoading] = useState(false)

  async function handleSignOut() {
    setLoading(true)
    await signOut()
  }

  const initial = nickname?.[0]?.toUpperCase() ?? '?'

  // ⭕ 3. 관리자 이메일 판별 조건문 생성 (본인 이메일 주소로 변경하세요!)
  const isAdmin = email === '본인이메일@example.com'

  return (
    <nav style={{
      background: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      boxShadow: 'var(--shadow)',
      position: 'sticky', top: 0, zIndex: 50,
    }}>
      <div style={{
        maxWidth: 1100, margin: '0 auto', padding: '0 24px',
        height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, var(--primary), #a78bfa)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
            }}>✦</div>
            <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--primary)', letterSpacing: '-0.5px' }}>
              Portfolio Hub
            </span>
          </div>
        </Link>

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/portfolio" style={{
            textDecoration: 'none', color: 'var(--text-muted)', fontWeight: 500, fontSize: 15,
            padding: '6px 14px', borderRadius: 8,
          }}>
            게시판
          </Link>

          {isLoggedIn ? (
            <>
              {/* ⭕ 4. 로그인된 유저 중 '관리자' 일 때만 버튼이 보이도록 제한! */}
              {isAdmin && (
                <Link href="/portfolio/new" style={{
                  textDecoration: 'none',
                  background: 'var(--primary)', color: '#fff',
                  fontWeight: 600, fontSize: 14,
                  padding: '8px 18px', borderRadius: 10,
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  <span style={{ fontSize: 16 }}>+</span> 작성하기
                </Link>
              )}

              {/* 닉네임 뱃지 */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '6px 12px', background: 'var(--surface2)', borderRadius: 10,
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary), #a78bfa)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0,
                }}>
                  {initial}
                </div>
                <span style={{
                  fontSize: 14, fontWeight: 600, color: 'var(--text)',
                  maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {nickname}
                </span>
              </div>

              <button
                onClick={handleSignOut}
                disabled={loading}
                style={{
                  background: 'none', border: '1px solid var(--border)',
                  color: 'var(--text-muted)', fontSize: 14, fontWeight: 500,
                  padding: '7px 14px', borderRadius: 8,
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                {loading ? '...' : '로그아웃'}
              </button>
            </>
          ) : (
            <Link href="/" style={{
              textDecoration: 'none', background: 'var(--primary)', color: '#fff',
              fontWeight: 600, fontSize: 14, padding: '8px 18px', borderRadius: 10,
            }}>
              로그인
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}