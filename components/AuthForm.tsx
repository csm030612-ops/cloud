'use client'

import { useState } from 'react'
import { signInWithEmail, signUpWithEmail } from '@/lib/actions'

export default function AuthForm() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [nickname, setNickname] = useState('')
  const [nicknameMsg, setNicknameMsg] = useState('')

  function validateNickname(val: string) {
    if (val.length === 0)  return ''
    if (val.length < 2)   return '2자 이상 입력해주세요'
    if (val.length > 20)  return '20자 이하로 입력해주세요'
    if (!/^[가-힣a-zA-Z0-9_]+$/.test(val)) return '한글, 영문, 숫자, _만 사용 가능해요'
    return '✓'
  }

  function handleNicknameChange(val: string) {
    setNickname(val)
    setNicknameMsg(validateNickname(val))
  }

  async function handleSubmit(formData: FormData) {
    setError('')
    setSuccess('')
    setLoading(true)

    const result = mode === 'login'
      ? await signInWithEmail(formData)
      : await signUpWithEmail(formData)

    setLoading(false)

    if (result && 'error' in result && result.error) setError(result.error)
    if (result && 'success' in result && result.success) setSuccess(result.success)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    border: '1.5px solid var(--border)',
    borderRadius: 10,
    fontSize: 15,
    fontFamily: 'inherit',
    color: 'var(--text)',
    background: '#fafafa',
    outline: 'none',
    transition: 'border-color 0.15s',
  }

  const labelStyle: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--text)',
    display: 'block',
    marginBottom: 6,
  }

  const isNicknameValid = nicknameMsg === '✓'

  return (
    <div style={{
      background: 'var(--surface)',
      borderRadius: 20,
      boxShadow: 'var(--shadow-md)',
      padding: '40px',
      width: '100%',
      maxWidth: 420,
      border: '1px solid var(--border)',
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{
          width: 56, height: 56, borderRadius: 16,
          background: 'linear-gradient(135deg, var(--primary), #a78bfa)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 26, margin: '0 auto 14px',
        }}>✦</div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', margin: '0 0 6px' }}>
          {mode === 'login' ? '다시 만나요! 👋' : '시작해봐요! 🚀'}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>
          {mode === 'login' ? '포트폴리오 허브에 오신걸 환영해요' : '닉네임으로 활동해요'}
        </p>
      </div>

      {/* Mode toggle */}
      <div style={{
        display: 'flex', background: 'var(--surface2)',
        borderRadius: 10, padding: 4, marginBottom: 24, gap: 4,
      }}>
        {(['login', 'signup'] as const).map(m => (
          <button key={m}
            onClick={() => { setMode(m); setError(''); setSuccess(''); setNickname(''); setNicknameMsg('') }}
            style={{
              flex: 1, padding: '8px', borderRadius: 8, border: 'none',
              cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, fontWeight: 600,
              transition: 'all 0.2s',
              background: mode === m ? 'var(--primary)' : 'transparent',
              color: mode === m ? '#fff' : 'var(--text-muted)',
            }}
          >
            {m === 'login' ? '로그인' : '회원가입'}
          </button>
        ))}
      </div>

      {/* Form */}
      <form action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* 닉네임 — 회원가입 탭에서만 표시 */}
        {mode === 'signup' && (
          <div>
            <label style={labelStyle}>
              닉네임
              {nicknameMsg && (
                <span style={{
                  marginLeft: 8,
                  fontSize: 12,
                  fontWeight: 500,
                  color: isNicknameValid ? 'var(--success)' : '#f59e0b',
                }}>
                  {nicknameMsg}
                </span>
              )}
            </label>
            <input
              name="nickname"
              type="text"
              placeholder="ex) dev_kim, 개발왕민준"
              required
              value={nickname}
              onChange={e => handleNicknameChange(e.target.value)}
              style={{
                ...inputStyle,
                borderColor: nickname
                  ? isNicknameValid ? 'var(--success)' : '#f59e0b'
                  : 'var(--border)',
              }}
              onFocus={e => {
                if (!nickname) e.target.style.borderColor = 'var(--primary)'
              }}
              onBlur={e => {
                if (!nickname) e.target.style.borderColor = 'var(--border)'
              }}
            />
            <p style={{ margin: '5px 0 0', fontSize: 12, color: 'var(--text-muted)' }}>
              한글, 영문, 숫자, _ 조합 · 2~20자 · 나중에 변경 불가
            </p>
          </div>
        )}

        {/* 이메일 */}
        <div>
          <label style={labelStyle}>이메일</label>
          <input
            name="email" type="email" placeholder="hello@example.com" required
            style={inputStyle}
            onFocus={e => (e.target.style.borderColor = 'var(--primary)')}
            onBlur={e => (e.target.style.borderColor = 'var(--border)')}
          />
        </div>

        {/* 비밀번호 */}
        <div>
          <label style={labelStyle}>비밀번호</label>
          <input
            name="password" type="password" placeholder="••••••••" required minLength={6}
            style={inputStyle}
            onFocus={e => (e.target.style.borderColor = 'var(--primary)')}
            onBlur={e => (e.target.style.borderColor = 'var(--border)')}
          />
          {mode === 'signup' && (
            <p style={{ margin: '5px 0 0', fontSize: 12, color: 'var(--text-muted)' }}>
              6자 이상
            </p>
          )}
        </div>

        {error && (
          <div style={{
            background: '#fef2f2', border: '1px solid #fecaca',
            borderRadius: 8, padding: '10px 14px', fontSize: 13, color: 'var(--danger)',
          }}>
            ⚠️ {error}
          </div>
        )}
        {success && (
          <div style={{
            background: '#f0fdf4', border: '1px solid #bbf7d0',
            borderRadius: 8, padding: '10px 14px', fontSize: 13, color: 'var(--success)',
          }}>
            ✅ {success}
          </div>
        )}

        <button type="submit" disabled={loading} style={{
          marginTop: 4,
          background: loading ? 'var(--primary-mid)' : 'linear-gradient(135deg, var(--primary), #a78bfa)',
          color: '#fff', border: 'none', borderRadius: 12, padding: '14px',
          fontSize: 16, fontWeight: 700, fontFamily: 'inherit',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}>
          {loading ? '처리중...' : mode === 'login' ? '로그인하기 →' : '가입하기 →'}
        </button>
      </form>
    </div>
  )
}
