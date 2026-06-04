'use client'

import { useState } from 'react'
import { deletePortfolio } from '@/lib/actions'
import type { Portfolio } from '@/lib/types'

const TAG_COLORS = [
  { bg: '#ede9fe', text: '#6d28d9' },
  { bg: '#dbeafe', text: '#1d4ed8' },
  { bg: '#d1fae5', text: '#065f46' },
  { bg: '#fef3c7', text: '#92400e' },
  { bg: '#fce7f3', text: '#9d174d' },
  { bg: '#fee2e2', text: '#991b1b' },
]

function tagColor(tag: string) {
  let h = 0
  for (const c of tag) h = (h * 31 + c.charCodeAt(0)) % TAG_COLORS.length
  return TAG_COLORS[h]
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days  = Math.floor(diff / 86400000)
  if (mins < 1)   return '방금 전'
  if (mins < 60)  return `${mins}분 전`
  if (hours < 24) return `${hours}시간 전`
  return `${days}일 전`
}

// 닉네임 → 아바타 색 (항상 같은 색이 나오도록)
const AVATAR_COLORS = [
  { bg: 'linear-gradient(135deg,#7c3aed,#a78bfa)', text: '#fff' },
  { bg: 'linear-gradient(135deg,#0ea5e9,#38bdf8)', text: '#fff' },
  { bg: 'linear-gradient(135deg,#10b981,#34d399)', text: '#fff' },
  { bg: 'linear-gradient(135deg,#f59e0b,#fbbf24)', text: '#fff' },
  { bg: 'linear-gradient(135deg,#ef4444,#f87171)', text: '#fff' },
  { bg: 'linear-gradient(135deg,#ec4899,#f472b6)', text: '#fff' },
]

function avatarColor(nickname: string) {
  let h = 0
  for (const c of nickname) h = (h * 31 + c.charCodeAt(0)) % AVATAR_COLORS.length
  return AVATAR_COLORS[h]
}

export default function PortfolioCard({
  portfolio,
  currentUserId,
}: {
  portfolio: Portfolio
  currentUserId?: string
}) {
  const [deleting, setDeleting] = useState(false)
  const [confirm,  setConfirm]  = useState(false)
  const isOwner = currentUserId === portfolio.user_id
  const av = avatarColor(portfolio.nickname)

  async function handleDelete() {
    if (!confirm) { setConfirm(true); return }
    setDeleting(true)
    await deletePortfolio(portfolio.id)
    setDeleting(false)
  }

  return (
    <div
      style={{
        background: 'var(--surface)', borderRadius: 18,
        border: '1px solid var(--border)', boxShadow: 'var(--shadow)',
        overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s',
        display: 'flex', flexDirection: 'column',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'
        ;(e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-md)'
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
        ;(e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow)'
      }}
    >
      {/* Card header */}
      <div style={{
        background: 'linear-gradient(135deg, var(--primary-light), #f5f3ff)',
        padding: '22px 22px 18px',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Emoji icon */}
          <div style={{
            width: 50, height: 50, borderRadius: 14, background: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', flexShrink: 0,
          }}>
            {portfolio.thumbnail_emoji}
          </div>

          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', margin: '0 0 6px', lineHeight: 1.3 }}>
              {portfolio.title}
            </h3>

            {/* 작성자 닉네임 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 20, height: 20, borderRadius: '50%',
                background: av.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 700, color: av.text, flexShrink: 0,
              }}>
                {portfolio.nickname[0].toUpperCase()}
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--primary)' }}>
                {portfolio.nickname}
              </span>
              <span style={{ color: 'var(--border)', fontSize: 12 }}>·</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {timeAgo(portfolio.created_at)}
              </span>
            </div>
          </div>
        </div>

        {/* 삭제 버튼 (본인만) */}
        {isOwner && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            title={confirm ? '한번 더 클릭하면 삭제돼요' : '삭제'}
            style={{
              background: confirm ? '#fef2f2' : 'rgba(255,255,255,0.8)',
              border: confirm ? '1px solid #fecaca' : '1px solid var(--border)',
              color: confirm ? 'var(--danger)' : 'var(--text-muted)',
              borderRadius: 8, width: 32, height: 32,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: deleting ? 'not-allowed' : 'pointer',
              fontSize: 15, flexShrink: 0, fontFamily: 'inherit',
            }}
            onMouseLeave={() => setTimeout(() => setConfirm(false), 2000)}
          >
            {deleting ? '⏳' : confirm ? '‼️' : '🗑'}
          </button>
        )}
      </div>

      {/* Description */}
      <div style={{ padding: '16px 22px', flex: 1 }}>
        <p style={{
          fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7, margin: '0 0 14px',
          display: '-webkit-box', WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {portfolio.description}
        </p>

        {/* Tech stack */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {portfolio.tech_stack.map(tech => {
            const c = tagColor(tech)
            return (
              <span key={tech} style={{
                background: c.bg, color: c.text,
                fontSize: 11, fontWeight: 600,
                padding: '3px 10px', borderRadius: 20,
                fontFamily: 'Fira Code, monospace', letterSpacing: '0.02em',
              }}>
                {tech}
              </span>
            )
          })}
        </div>
      </div>

      {/* Links */}
      {(portfolio.project_url || portfolio.github_url) && (
        <div style={{ padding: '12px 22px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
          {portfolio.project_url && (
            <a href={portfolio.project_url} target="_blank" rel="noopener noreferrer" style={{
              textDecoration: 'none', fontSize: 13, fontWeight: 600,
              color: 'var(--primary)', background: 'var(--primary-light)',
              padding: '6px 14px', borderRadius: 8,
              display: 'flex', alignItems: 'center', gap: 5,
            }}>
              🔗 사이트 보기
            </a>
          )}
          {portfolio.github_url && (
            <a href={portfolio.github_url} target="_blank" rel="noopener noreferrer" style={{
              textDecoration: 'none', fontSize: 13, fontWeight: 600,
              color: 'var(--text-muted)', background: 'var(--surface2)',
              padding: '6px 14px', borderRadius: 8,
              display: 'flex', alignItems: 'center', gap: 5,
            }}>
              🐙 GitHub
            </a>
          )}
        </div>
      )}
    </div>
  )
}
