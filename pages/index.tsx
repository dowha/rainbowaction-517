'use client'

import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Step1_UploadAndSelect from '@/components/ProfileSteps/Step1_UploadAndSelect'
import Step2_PreviewAndDownload from '@/components/ProfileSteps/Step2_PreviewAndDownload'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [step, setStep] = useState<0 | 1 | 2>(0)
  const [image, setImage] = useState<File | null>(null)
  const [overlayFile, setOverlayFile] = useState('517asset-00.png')
  const [isInAppBrowser, setIsInAppBrowser] = useState(false)
  const [referralSource, setReferralSource] = useState<string | null>(null)

  useEffect(() => {
    if (!localStorage.getItem('anonymous_id')) {
      localStorage.setItem('anonymous_id', crypto.randomUUID())
    }
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' })
    }, 100)

    return () => clearTimeout(timeout)
  }, [step])

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase()
    const inAppPatterns = [
      'instagram',
      'fbav',
      'fb_iab',
      'fban',
      'twitter',
      'tiktok',
      'pinterest',
      'reddit',
      'linkedin',
      'telegram',
      'telegrambot',
      'slack',
      'line',
      'kakaotalk',
      'wechat',
      'whatsapp',
      'messenger',
      'naver',
      'daum',
      'youtube',
      'snapchat',
      'discord',
    ]
    const isInApp = inAppPatterns.some((pattern) => ua.includes(pattern))
    setIsInAppBrowser(isInApp)
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const refValue = urlParams.get('ref')
      setReferralSource(refValue)
    }
  }, [])

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <title>5·17 성소수자 평등의 날 공동행동 평등위원 프로필 꾸미기</title>
        <meta
          name="description"
          content="프로필 사진에 아이템을 추가해 성소수자 '평등 실현'과 '권리 보장'을 요구해주세요!"
        />
        <meta property="og:title" content="5·17 성소수자 평등의 날 공동행동 평등위원 프로필 꾸미기" />
        <meta
          property="og:description"
          content="프로필 사진에 아이템을 추가해 성소수자 '평등 실현'과 '권리 보장'을 요구해주세요!"
        />
        <meta
          property="og:image"
          content="https://profile.rainbowaction.kr/og-image.png"
        />
        <meta property="og:url" content="https://profile.rainbowaction.kr/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="5·17 성소수자 평등의 날 공동행동 평등위원 프로필 꾸미기" />
        <meta
          name="twitter:description"
          content="프로필 사진에 아이템을 추가해 성소수자 '평등 실현'과 '권리 보장'을 요구해주세요!"
        />
        <meta
          name="twitter:image"
          content="https://profile.rainbowaction.kr/og-image-twitter.png"
        />
      </Head>

      <div
        className="flex flex-col min-h-screen bg-center bg-cover bg-no-repeat"
        style={{ backgroundImage: "url('/bg.png')", minHeight: '100dvh' }}
      >
        <header className="sticky top-0 z-50 w-full">
          <div className="max-w-[420px] mx-auto h-20 relative py-5 bg-[#EC6C00] border-b border-[#EC6C00]">
            <Image
              src="/logo.png"
              alt="무지개행동 로고"
              fill
              priority
              className="object-contain cursor-pointer"
              onClick={() => {
                setImage(null)
                setOverlayFile('517asset-00.png')
                setStep(0)
              }}
            />
          </div>
        </header>

        <main className="flex-1 min-h-0 w-full max-w-[420px] mx-auto bg-white flex flex-col">
          <div className="w-full px-4 pt-4 pb-6 flex-grow">
            <div
              key={step}
              className="transition-opacity duration-300 ease-in-out animate-fade"
            >
              {step === 0 ? (
                <div className="text-center space-y-6">
                  {isInAppBrowser && (
                    <p className="text-xs text-red-800 px-4 py-3 border border-red-300 bg-red-50 rounded-2xl animate-pulse">
                      ⚠️ 텔레그램, 인스타그램, 페이스북 등 일부 앱의 내부
                      브라우저에서는 이미지가 정상적으로 다운로드되지 않을 수
                      있습니다.
                      <br />
                      <strong>외부 브라우저</strong>(크롬, 사파리 등)에서{' '}
                      <strong>다시</strong> 접속해주세요.
                    </p>
                  )}
                  <div className="bg-white border border-[#F4A261] rounded-2xl px-6 py-8">
                    <h1 className="text-xl font-bold text-[#BD3108] mb-2">
                      5·17 성소수자 평등의 날<br />공동행동 평등위원 프로필 꾸미기!
                    </h1>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      프로필 사진에 아이템을 추가해
                      <br />
                      성소수자 &apos;평등 실현&apos;과 &apos;권리 보장&apos;을 요구해주세요!
                    </p>
                    <button
                      onClick={async () => {
                        try {
                          await supabase.from('image_creations').insert({
                            stage: 'started',
                            anonymous_id: localStorage.getItem('anonymous_id'),
                            user_agent: navigator.userAgent,
                            referrer: document.referrer || null,
                            source: referralSource,
                          })
                        } catch (err) {
                          console.error('Supabase 기록 실패:', err)
                        } finally {
                          setStep(1)
                        }
                      }}
                      className="mt-6 px-6 py-2.5 text-white text-sm font-semibold bg-[#BD3108] hover:bg-[#8B2200] rounded-lg transition"
                    >
                      시작하기
                    </button>
                  </div>

                  <p className="text-xs text-slate-500 px-4 py-3 border border-slate-200 bg-slate-50 rounded-2xl">
                    🔒 이미지는 브라우저에서만 처리되며, 서버에{' '}
                    <strong className="text-slate-600">저장되지 않습니다.</strong>
                  </p>
                </div>
              ) : step === 1 || !image ? (
                <Step1_UploadAndSelect
                  image={image}
                  setImage={setImage}
                  overlayFile={overlayFile}
                  setOverlayFile={setOverlayFile}
                  onNext={() => setStep(2)}
                />
              ) : (
                <Step2_PreviewAndDownload
                  image={image!}
                  overlayFile={overlayFile}
                  setOverlayFile={setOverlayFile}
                  onReset={() => {
                    setImage(null)
                    setOverlayFile('517asset-00.png')
                    setStep(1)
                  }}
                />
              )}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="w-full mt-auto" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
          <div className="max-w-[420px] mx-auto text-center text-sm text-gray-400 bg-white pt-3">
            <div className="w-full bg-[#FFF8F0] text-[#BD3108] leading-tight text-center py-4 px-4 border-t border-[#F4A261] font-medium tracking-tight">
              전체 캠페인 정보는{' '}
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSd9tFla7XcOAytg6l0nAoRkWYSqZTlTJDSqmPYynyIXRlqfng/viewform"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                <strong>&lt;5·17 성소수자 평등의 날&gt; 공동행동</strong>
              </a>
              에서
              <br />
              확인하실 수 있어요.
            </div>
            <div className="w-full bg-[#FFE0B2] leading-tight text-center py-4 px-4 border-y border-[#F4A261] font-medium tracking-tight">
              <p className="text-gray-700">
                <span className="text-black">
                  <strong>후원하기</strong>
                </span>
                <br />
                <a
                  href="https://donate.do/queer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2"
                >
                  donate.do/queer
                </a>
              </p>
            </div>
            <p className="py-2 text-sm text-black">
              © 2026 한국성소수자인권단체연합{' '}
              <a
                href="mailto:contact@rainbowaction.kr"
                className="text-black no-underline"
              >
                무지개행동
              </a>
              .
            </p>
          </div>
        </footer>
      </div>
    </>
  )
}
