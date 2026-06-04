'use client'

import { useState, useRef, KeyboardEvent } from 'react'
import { useRouter } from 'next/navigation'
import { createPortfolio } from '@/lib/actions'

const EMOJIS = ['🚀', '💡', '🎨', '🛠️', '📱', '🌐', '🎯', '⚡', '🔥', '🐙',
  '🎮', '📊', '🤖', '🧠', '🦄', '💎', '🌟', '🔮', '🏗️', '📡']

export default function PortfolioForm() {
  const router = useRouter()
  const [emoji, setEmoji] = useState('🚀')
  const [showEmojis, setShowEmojis] = useState(false)
  const [techStack, setTechStack] = useState<string[]>([])
  const [techInput, setTechInput] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function addTech() {
    const t = techInput.trim()
    if (t && !techStack.includes(t)) setTechStack(prev => [...prev, t])
    setTechInput('')
  }

  function handleTechKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTech() }
    if (e.key === 'Backspace' && !techInput && techStack.length > 0) {
      setTechStack(prev => prev.slice(0, -1))
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // if (techStack.length === 0) { setError('기술 스택을 최소 1개 입력해주세요.'); return }
    setLoading(true)
    setError('')

    const fd = new FormData(e.currentTarget)
    const result = await createPortfolio({
      title: fd.get('title') as string,
      description: fd.get('description') as string,
      project_url: fd.get('project_url') as string || undefined,
      github_url: fd.get('github_url') as string || undefined,
      tech_stack: techStack,
      thumbnail_emoji: emoji,
    })

    setLoading(false)
    if (result?.error) setError(result.error)
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

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Emoji + Title row */}
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-end' }}>
        <div>
          <label style={labelStyle}>아이콘</label>
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setShowEmojis(!showEmojis)}
              style={{
                width: 56,
                height: 50,
                borderRadius: 10,
                border: '1.5px solid var(--border)',
                background: 'var(--primary-light)',
                fontSize: 26,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {emoji}
            </button>
            {showEmojis && (
              <div style={{
                position: 'absolute',
                top: '110%',
                left: 0,
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                padding: 8,
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: 4,
                boxShadow: 'var(--shadow-md)',
                zIndex: 10,
              }}>
                {EMOJIS.map(e => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => { setEmoji(e); setShowEmojis(false) }}
                    style={{
                      background: emoji === e ? 'var(--primary-light)' : 'transparent',
                      border: 'none',
                      borderRadius: 8,
                      padding: 6,
                      fontSize: 20,
                      cursor: 'pointer',
                    }}
                  >
                    {e}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <label style={labelStyle} htmlFor="title">프로젝트 이름 *</label>
          <input
            id="title"
            name="title"
            required
            placeholder="멋진 프로젝트 이름"
            style={inputStyle}
            onFocus={e => (e.target.style.borderColor = 'var(--primary)')}
            onBlur={e => (e.target.style.borderColor = 'var(--border)')}
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label style={labelStyle} htmlFor="description">프로젝트 설명 *</label>
        <textarea
          id="description"
          name="description"
          required
          rows={4}
          placeholder="어떤 프로젝트인지, 어떤 문제를 해결했는지 설명해주세요."
          style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
          onFocus={e => (e.target.style.borderColor = 'var(--primary)')}
          onBlur={e => (e.target.style.borderColor = 'var(--border)')}
        />
      </div>

      {/* Tech stack */}
      <div>
        <label style={labelStyle}>기술 스택 <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(엔터 또는 쉼표로 추가)</span></label>
        <div style={{
          border: '1.5px solid var(--border)',
          borderRadius: 10,
          padding: '8px 12px',
          background: '#fafafa',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 6,
          minHeight: 50,
          alignItems: 'center',
          transition: 'border-color 0.15s',
        }}
          onClick={() => document.getElementById('tech-input')?.focus()}
        >
          {techStack.map(t => (
            <span key={t} style={{
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              fontSize: 12,
              fontWeight: 600,
              padding: '4px 10px',
              borderRadius: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              fontFamily: 'Fira Code, monospace',
            }}>
              {t}
              <button
                type="button"
                onClick={e => { e.stopPropagation(); setTechStack(prev => prev.filter(x => x !== t)) }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', padding: 0, lineHeight: 1, fontSize: 14 }}
              >×</button>
            </span>
          ))}
          <input
            id="tech-input"
            value={techInput}
            onChange={e => setTechInput(e.target.value)}
            onKeyDown={handleTechKey}
            onBlur={addTech}
            placeholder={techStack.length === 0 ? 'React, TypeScript, ...' : ''}
            style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 14, fontFamily: 'Fira Code, monospace', minWidth: 120, color: 'var(--text)' }}
          />
        </div>
      </div>

      {/* URLs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div>
          <label style={labelStyle} htmlFor="project_url">🔗 배포 URL</label>
          <input
            id="project_url"
            name="project_url"
            type="url"
            placeholder="https://myproject.com"
            style={inputStyle}
            onFocus={e => (e.target.style.borderColor = 'var(--primary)')}
            onBlur={e => (e.target.style.borderColor = 'var(--border)')}
          />
        </div>
        <div>
          <label style={labelStyle} htmlFor="github_url">🐙 GitHub URL</label>
          <input
            id="github_url"
            name="github_url"
            type="url"
            placeholder="https://github.com/user/repo"
            style={inputStyle}
            onFocus={e => (e.target.style.borderColor = 'var(--primary)')}
            onBlur={e => (e.target.style.borderColor = 'var(--border)')}
          />
        </div>
      </div>

      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: 'var(--danger)' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
        <button
          type="button"
          onClick={() => router.back()}
          style={{
            padding: '12px 24px',
            border: '1px solid var(--border)',
            borderRadius: 12,
            background: 'transparent',
            color: 'var(--text-muted)',
            fontSize: 15,
            fontWeight: 600,
            fontFamily: 'inherit',
            cursor: 'pointer',
          }}
        >
          취소
        </button>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '12px 32px',
            border: 'none',
            borderRadius: 12,
            background: loading ? 'var(--primary-mid)' : 'linear-gradient(135deg, var(--primary), #a78bfa)',
            color: '#fff',
            fontSize: 15,
            fontWeight: 700,
            fontFamily: 'inherit',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? '저장 중...' : '포트폴리오 등록하기 ✨'}
        </button>
      </div>
    </form>
  )
}
