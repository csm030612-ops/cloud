'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { CreatePortfolioInput } from '@/lib/types'

// ── Auth ──────────────────────────────────────────────

export async function signInWithEmail(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: error.message }

  revalidatePath('/', 'layout')
  redirect('/portfolio')
}

export async function signUpWithEmail(formData: FormData) {
  const supabase = await createClient()
  const email    = formData.get('email')    as string
  const password = formData.get('password') as string
  const nickname = (formData.get('nickname') as string).trim()

  // 닉네임 유효성 검사
  if (!nickname || nickname.length < 2) {
    return { error: '닉네임은 2자 이상이어야 해요.' }
  }
  if (nickname.length > 20) {
    return { error: '닉네임은 20자 이하여야 해요.' }
  }
  if (!/^[가-힣a-zA-Z0-9_]+$/.test(nickname)) {
    return { error: '닉네임은 한글, 영문, 숫자, 밑줄(_)만 사용할 수 있어요.' }
  }

  // 닉네임 중복 확인
  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('nickname', nickname)
    .maybeSingle()

  if (existing) return { error: '이미 사용 중인 닉네임이에요.' }

  // 회원가입
  const { data, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
    },
  })

  if (signUpError) return { error: signUpError.message }
  if (!data.user)  return { error: '회원가입에 실패했어요. 다시 시도해주세요.' }

  // 프로필(닉네임) 저장
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({ id: data.user.id, nickname })

  if (profileError) return { error: profileError.message }

  // 이메일 인증이 꺼져 있으면 바로 로그인 상태 → 갤러리로
  if (data.session) {
    revalidatePath('/', 'layout')
    redirect('/portfolio')
  }

  return { success: '가입 확인 이메일을 보냈어요! 이메일을 확인해주세요.' }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}

// ── Profile ───────────────────────────────────────────

export async function getMyProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  return data
}

// ── Portfolio ─────────────────────────────────────────

export async function createPortfolio(input: CreatePortfolioInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '로그인이 필요해요.' }

  // 👈 [추가] 관리자 계정이 아니라면 DB 입력을 사전에 차단하고 에러를 리턴합니다.
  if (user.email !== '본인의-관리자-이메일@gmail.com') {
    return { error: '권한이 없습니다. 관리자만 등록할 수 있습니다.' }
  }

  // 현재 유저의 닉네임 조회
  const { data: profile } = await supabase
    .from('profiles')
    .select('nickname')
    .eq('id', user.id)
    .maybeSingle()

  if (!profile) return { error: '프로필을 찾을 수 없어요.' }

  const { error } = await supabase.from('portfolios').insert({
    ...input,
    user_id: user.id,
    nickname: profile.nickname,
  })

  if (error) return { error: error.message }

  revalidatePath('/portfolio')
  redirect('/portfolio')
}

export async function deletePortfolio(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '로그인이 필요해요.' }

  const { error } = await supabase
    .from('portfolios')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/portfolio')
  return { success: true }
}

export async function getPortfolios() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('portfolios')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return { data: [], error: error.message }
  return { data: data ?? [], error: null }
}