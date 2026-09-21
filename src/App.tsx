import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
} from 'react'
import {
  Route,
  Routes,
  useNavigate,
  useParams,
} from 'react-router-dom'
import './App.css'

type ProjectSection = {
  title: string
  body: string
}

type ProjectImage = {
  src: string
  alt: string
  caption?: string
  type?: 'wide' | 'mobile'
}

type Project = {
  id: string
  slug: string
  name: string
  type: 'TEAM' | 'PERSONAL'
  subtitle: string
  color: string

  media: string
  mediaType: 'video' | 'image'

  overview: string
  period: string
  role: string

  stack: string[]

  github?: string
  performance?: string
  liveSite?: string

  testCaseImage?: string
  testCaseLink?: string

  gallery?: ProjectImage[]

  sections: ProjectSection[]
}

const projects: Project[] = [
  {
    id: '01',
    slug: 'hankki-pot',
    name: 'HANKKI POT',
    type: 'TEAM',
    subtitle: 'University Meal Matching Platform',
    color: '#ff6b45',

    media: '/projects/hankkipot.mp4',
    mediaType: 'video',

    overview:
        '혼밥은 줄이고, 연결은 늘리다. 같은 학교 학생끼리 밥약을 만들고, 채팅으로 약속을 잡고, 실제 만남까지 안전하게 인증하는 대학생 식사 매칭 플랫폼입니다.',

    period: '2026.05.12 — 2026.06.22',
    role: 'BACKEND',

    github:
        'https://github.com/Team3-Final-Project-SNS/Final-project',

    performance:
        'https://app.notion.com/p/teamsparta/API-37a2dc3ef51480858c7dd6a6f288ac51',

    stack: [
      'Java',
      'Spring Boot',
      'MySQL',
      'JPA',
      'Redis',
      'Kafka',
      'WebSocket',
      'STOMP',
      'SockJS',
      'SSE',
      'K6',
    ],

    sections: [
      {
        title: 'MY ROLE',
        body:
            '백엔드 개발자로 참여해 알림, 채팅, 신고 도메인을 담당했습니다. 기능 구현뿐 아니라 알림과 채팅의 비동기 처리 구조를 개선하고 Redis 캐싱과 K6 부하 테스트를 통해 고부하 상황의 성능도 검증했습니다.',
      },
      {
        title: 'NOTIFICATION',
        body:
            '매칭, 채팅, 인증, 노쇼, 문의 등 서비스 전반에서 발생하는 이벤트를 SSE 기반 실시간 알림으로 전달했습니다. 초기에는 각 도메인 서비스에서 알림 로직을 직접 호출했지만 이벤트 발행 구조로 변경해 도메인 간 결합도를 낮췄습니다.',
      },
      {
        title: 'CHAT',
        body:
            'WebSocket + STOMP + SockJS 기반 실시간 채팅을 구현했습니다. 매칭이 확정되면 1:1 또는 그룹 채팅방이 자동 생성되며, 초기 Redis Pub/Sub 기반 메시징 구조를 Kafka 기반으로 전환했습니다.',
      },
      {
        title: 'WHY KAFKA',
        body:
            '채팅과 알림은 사용자 요청에는 빠르게 응답하면서 메시지를 안정적으로 비동기 처리해야 했습니다. Kafka의 파티션 기반 처리, 메시지 저장, Consumer 장애 시 재처리 가능한 구조를 활용하기 위해 @Async와 Redis Pub/Sub 중심의 구조를 Kafka 기반 이벤트 처리로 전환했습니다.',
      },
      {
        title: 'KAFKA RELIABILITY',
        body:
            'Consumer 내부에서 예외가 처리되어 Kafka까지 전달되지 않으면 Retry와 DLT가 동작하지 않는 문제를 발견했습니다. 실패 시 Redis 멱등성 키를 제거한 뒤 예외를 다시 전파하고 saveAndFlush()로 DB 저장 실패를 즉시 감지하도록 수정했습니다.',
      },
      {
        title: 'IDEMPOTENCY',
        body:
            'Kafka 메시지 중복 처리를 막기 위해 Redis SET NX 기반 eventId 멱등성 검사를 사용했습니다. DB 저장이 실패한 경우 기존 eventId가 남아 재시도 메시지가 다시 차단되는 문제를 확인하고 실패 시 멱등성 키를 삭제하도록 보완했습니다.',
      },
      {
        title: 'REDIS CACHE',
        body:
            '반복 조회되는 알림 목록과 미확인 알림 수의 DB 접근을 줄이기 위해 Redis 캐싱을 적용했습니다. 알림 목록은 30초, 미확인 알림 수는 10초 TTL을 적용했습니다.',
      },
      {
        title: 'CACHE INVALIDATION',
        body:
            '새로운 알림 저장, 단건 읽음, 전체 읽음 처리 시 관련 캐시를 즉시 무효화하도록 구현했습니다. 이후 재조회 시 DB에서 최신 데이터를 가져와 다시 캐싱하도록 구성했습니다.',
      },
      {
        title: 'PERFORMANCE TEST',
        body:
            'K6로 Smoke, Load, Stress, Spike 테스트를 수행해 Redis 캐싱 적용 전후를 비교했습니다. 1,000 VU Stress 테스트에서 p95가 1.41초에서 약 277ms로 감소했고 RPS도 증가했습니다.',
      },
      {
        title: 'REPORT',
        body:
            '서비스 이용 중 부적절한 사용자나 상황을 신고할 수 있도록 신고 도메인의 API와 비즈니스 로직을 구현했습니다.',
      },
      {
        title: 'TROUBLESHOOTING',
        body:
            'Kafka Retry와 Redis 멱등성 처리가 서로 영향을 주는 문제를 해결하면서, 비동기 처리에서는 Retry, DLT, 멱등성을 하나의 실패 처리 흐름으로 함께 설계해야 한다는 점을 경험했습니다.',
      },
    ],
  },

  {
    id: '02',
    slug: 'redis7',
    name: 'REDIS7',
    type: 'TEAM',
    subtitle: 'Developer Freelance Matching Platform',
    color: '#3155ff',

    media: '/projects/redis7.mp4',
    mediaType: 'video',

    overview:
        '개발자와 의뢰자를 실시간으로 연결하는 용역 매칭 플랫폼입니다. 프로젝트 등록, 제안서 제출, 실시간 채팅, 리뷰까지 프리랜서 개발 생태계의 핵심 흐름을 하나의 서비스로 통합했습니다.',

    period: '2026.04.08 — 2026.04.28',
    role: 'BACKEND / SCRIBE',

    github:
        'https://github.com/Ready-s7/Readys7-project',

    performance:
        'https://app.notion.com/p/teamsparta/2026-4-16-2026-4-22-3442dc3ef51480d4b0c9c06561fb1da3',

    testCaseImage:
        '/projects/redis7-testcase.png',

    testCaseLink:
        'https://docs.google.com/spreadsheets/d/1UahlJ9cs7ue8WMfdZwYdxxMLXG3OBTsU/edit?gid=194753174#gid=194753174',

    stack: [
      'Java',
      'Spring Boot',
      'MySQL',
      'JPA',
      'Redis',
      'Redisson',
      'HikariCP',
      'Docker',
    ],

    sections: [
      {
        title: 'MY ROLE',
        body:
            '백엔드 개발자로 개발자 프로필 도메인과 동시성 제어를 담당했습니다. 또한 팀 내 서기를 맡아 회의 내용과 문서를 정리하고 브라우저 테스트 케이스를 작성해 총 3차례의 QA를 진행했습니다.',
      },
      {
        title: 'DEVELOPER PROFILE',
        body:
            '개발자가 자신의 정보를 관리하고 프로젝트 매칭 과정에서 필요한 프로필 정보를 제공할 수 있도록 개발자 도메인의 API와 비즈니스 로직을 구현했습니다.',
      },
      {
        title: 'CONCURRENCY',
        body:
            '모든 동시성 문제에 동일한 락을 적용하지 않고 실제 충돌 빈도와 서비스 특성을 기준으로 제안서 제출과 리뷰 평점 갱신에 서로 다른 동시성 제어 방식을 선택했습니다.',
      },
      {
        title: 'PROPOSAL LOCK',
        body:
            '인기 프로젝트에 여러 개발자가 동시에 제안서를 제출하면 최대 모집 인원을 초과할 수 있는 Race Condition을 고려했습니다. 순간적으로 요청이 집중될 수 있는 상황에서 정합성을 유지하기 위해 Redisson 분산 락을 적용했습니다.',
      },
      {
        title: 'WHY REDISSON',
        body:
            '낙관적 락, 비관적 락, Lettuce, Redisson을 비교했습니다. 향후 Scale-out 가능성과 순간적인 충돌을 고려해 분산 환경에서 사용할 수 있고 Pub/Sub 기반 대기 방식을 사용하는 Redisson을 선택했습니다.',
      },
      {
        title: 'OPTIMISTIC LOCK',
        body:
            '리뷰 평점 갱신은 충돌 가능성이 낮다고 판단해 @Version 기반 낙관적 락을 적용했습니다. 도메인의 실제 충돌 패턴에 따라 서로 다른 동시성 전략을 선택했습니다.',
      },
      {
        title: 'CONNECTION POOL',
        body:
            'DB Connection Pool 크기에 따른 처리 성능을 비교했습니다. 테스트 환경에서 기본값 10개보다 16개에서 약 30%의 개선을 확인했고, 40개에서는 오히려 처리 속도가 저하되는 결과를 확인했습니다.',
      },
      {
        title: 'PERFORMANCE ANALYSIS',
        body:
            '커넥션 수를 무조건 늘리는 것이 성능 개선으로 이어지지 않는다는 점을 실험을 통해 확인했습니다. 실행 환경에 맞는 적정값을 실제 테스트로 찾아가는 과정이 중요하다는 점을 배웠습니다.',
      },
      {
        title: 'DOCUMENTATION',
        body:
            '팀 내 서기를 맡아 회의 내용과 API 명세, 개발 진행 내용을 취합했습니다. 팀원별로 나뉜 내용을 한곳에서 확인할 수 있도록 문서를 정리했습니다.',
      },
      {
        title: 'QA',
        body:
            '기능별 정상·예외 시나리오를 기준으로 브라우저 테스트 케이스를 작성했습니다. 1차 테스트, 수정 후 2차 테스트, 실제 배포 환경 테스트까지 총 3차례 검증했습니다.',
      },
      {
        title: 'WHAT I LEARNED',
        body:
            '동시성 제어는 가장 강한 락을 선택하는 것이 아니라 충돌 빈도, 인프라 구조, 확장 가능성 등을 함께 고려해 선택해야 한다는 점을 배웠습니다.',
      },
    ],
  },

  {
    id: '03',
    slug: 'earthy',
    name: 'EARTHY',
    type: 'PERSONAL',
    subtitle: 'Postcard E-commerce Platform',
    color: '#7c684d',

    media: '/projects/earthy-main.png',
    mediaType: 'image',

    overview:
        '직접 촬영한 사진을 엽서와 포스터로 판매하기 위해 상품 탐색부터 주문·결제·재고·관리자 기능과 실제 배포까지 구현한 개인 E-commerce 프로젝트입니다.',

    period: '2026.07.14 — 2026.08.26',
    role: 'FULL STACK',

    liveSite:
        'https://earthy-shop.com',

    stack: [
      'Java',
      'Spring Boot',
      'Spring Security',
      'JPA',
      'MySQL',
      'JWT',
      'React',
      'TypeScript',
      'PortOne',
      'Kakao OAuth',
      'AWS S3',
      'AWS ECR',
      'AWS EC2',
      'CloudFront',
      'Docker',
      'GitHub Actions',
    ],

    gallery: [
      {
        src: '/projects/earthy-products.png',
        alt: 'Earthy product catalog',
        caption: 'PRODUCT CATALOG',
        type: 'wide',
      },
      {
        src: '/projects/earthy-about.png',
        alt: 'Earthy about page',
        caption: 'ABOUT EARTHY',
        type: 'wide',
      },
      {
        src: '/projects/earthy-admin.png',
        alt: 'Earthy admin product management',
        caption: 'ADMIN PRODUCT MANAGEMENT',
        type: 'wide',
      },
      {
        src: '/projects/earthy-cart-mobile.png',
        alt: 'Earthy mobile cart',
        caption: 'MOBILE CART',
        type: 'mobile',
      },
    ],

    sections: [
      {
        title: 'OVERVIEW',
        body:
            '직접 촬영한 사진을 상품으로 판매할 수 있는 실제 쇼핑몰을 목표로 기획부터 프론트엔드, 백엔드, 관리자 기능과 AWS 배포까지 전체 서비스를 직접 구현했습니다.',
      },
      {
        title: 'ORDER FLOW',
        body:
            '장바구니에서 전체 또는 선택한 상품을 주문할 수 있도록 구현했습니다. 주문 생성 직전에 상품·사이즈 옵션·추가상품 재고를 다시 검증하고 상품 금액과 배송비를 계산해 주문을 생성합니다.',
      },
      {
        title: 'IDEMPOTENCY',
        body:
            '장바구니 담기, 주문 생성, 결제 승인, 주문 취소처럼 중복 요청이 실제 데이터 변경으로 이어질 수 있는 API에 멱등성 키를 적용했습니다. 이미 완료된 동일 요청은 기존 결과를 반환하고 처리 중 요청은 차단합니다.',
      },
      {
        title: 'PAYMENT INTEGRITY',
        body:
            'PortOne 결제 승인 결과를 그대로 신뢰하지 않고 서버에서 실제 결제 정보를 다시 조회해 상태, 주문번호, 결제금액을 검증했습니다. 주문 잠금 조회와 중복 결제 검증을 거친 뒤에만 재고 차감과 결제 완료 처리를 수행합니다.',
      },
      {
        title: 'CANCEL & RESTORE',
        body:
            '고객과 관리자 주문 취소 모두 멱등성 키를 적용했습니다. 결제 완료 또는 상품 준비 상태의 주문을 취소할 경우 PortOne 결제를 취소한 뒤 상품, 사이즈 옵션, 추가상품 재고를 원래 수량으로 복구하도록 구현했습니다.',
      },
      {
        title: 'STOCK CONTROL',
        body:
            '주문 생성 단계에서 현재 재고를 검증하고 실제 재고 차감은 결제 검증 완료 후 수행합니다. 상품 재고 차감 시 잠금 조회를 이용해 동시에 접근하는 요청에서도 데이터 정합성을 유지하도록 구성했습니다.',
      },
      {
        title: 'AUTH & SECURITY',
        body:
            'Spring Security를 Stateless 방식으로 구성하고 JWT 인증을 적용했습니다. MEMBER와 ADMIN의 API 접근 권한을 분리하고 Access Token과 Refresh Token을 이용해 인증 상태를 관리합니다.',
      },
      {
        title: 'KAKAO OAUTH',
        body:
            'Kakao OAuth 로그인을 구현했습니다. 최초 로그인 사용자는 자동 회원가입 후 EARTHY의 Access Token과 Refresh Token을 발급받아 기존 JWT 인증 체계와 동일하게 사용할 수 있도록 연결했습니다.',
      },
      {
        title: 'IMAGE PIPELINE',
        body:
            '상품 이미지를 AWS S3에 저장하며 업로드 파일의 형식과 용량을 검증합니다. 대표 이미지와 상세 이미지를 각각 다른 기준으로 리사이즈·압축해 웹 표시용으로 최적화된 파일만 저장하도록 구성했습니다.',
      },
      {
        title: 'ADMIN',
        body:
            '상품 등록·수정·활성화·판매중지·삭제, 주문 조회와 상태 변경, 택배사 및 운송장 번호 등록 등 실제 쇼핑몰 운영에 필요한 관리자 기능을 구현했습니다.',
      },
      {
        title: 'DEPLOYMENT',
        body:
            'GitHub Actions의 workflow_dispatch를 이용해 전체, 백엔드, 프론트엔드 배포를 선택적으로 실행하도록 구성했습니다. 백엔드는 Docker 이미지를 ECR에 Push한 뒤 AWS SSM을 통해 EC2에서 Docker Compose로 재배포합니다.',
      },
      {
        title: 'FRONTEND DELIVERY',
        body:
            '프론트엔드는 GitHub Actions에서 pnpm으로 Vite 프로젝트를 빌드한 뒤 S3에 배포하고 CloudFront 캐시를 무효화해 최신 화면이 반영되도록 구성했습니다.',
      },
      {
        title: 'AWS OIDC',
        body:
            'GitHub Actions와 AWS IAM Role을 OIDC 방식으로 연결해 Workflow에 장기 Access Key를 저장하지 않고 AWS 리소스에 접근하도록 구성했습니다.',
      },
      {
        title: 'WHAT I LEARNED',
        body:
            '실제 결제가 포함된 서비스에서는 단순 기능 구현보다 주문, 결제, 재고, 취소의 데이터 정합성을 함께 관리하는 것이 중요하다는 점을 경험했습니다. 개발부터 실제 AWS 배포까지 하나의 서비스를 운영 가능한 상태로 연결하는 전체 과정을 경험했습니다.',
      },
    ],
  },
]

function App() {
  return (
      <Routes>
        <Route
            path="/"
            element={<Portfolio />}
        />

        <Route
            path="/projects/:slug"
            element={<ProjectDetail />}
        />
      </Routes>
  )
}

/* =========================================================
   PORTFOLIO
========================================================= */

function Portfolio() {
  const navigate = useNavigate()

  const heroRef =
      useRef<HTMLElement>(null)

  const cursorRef =
      useRef<HTMLDivElement>(null)

  const previewRef =
      useRef<HTMLDivElement>(null)

  const [activeProject, setActiveProject] =
      useState<Project | null>(null)

  useEffect(() => {
    window.scrollTo(0, 0)

    const revealTargets =
        document.querySelectorAll(
            '.reveal',
        )

    const observer =
        new IntersectionObserver(
            (entries) => {
              entries.forEach(
                  (entry) => {
                    if (
                        entry.isIntersecting
                    ) {
                      entry.target.classList.add(
                          'visible',
                      )
                    }
                  },
              )
            },
            {
              threshold: 0.1,
            },
        )

    revealTargets.forEach(
        (target) => {
          observer.observe(target)
        },
    )

    const handleScroll = () => {
      if (!heroRef.current) {
        return
      }

      const scrollY =
          window.scrollY

      heroRef.current.style.setProperty(
          '--hero-scroll',
          `${Math.min(
              scrollY * 0.12,
              70,
          )}px`,
      )
    }

    window.addEventListener(
        'scroll',
        handleScroll,
        {
          passive: true,
        },
    )

    return () => {
      observer.disconnect()

      window.removeEventListener(
          'scroll',
          handleScroll,
      )
    }
  }, [])

  const handleHeroMouseMove = (
      e: MouseEvent<HTMLElement>,
  ) => {
    if (!heroRef.current) {
      return
    }

    const rect =
        heroRef.current.getBoundingClientRect()

    const x =
        e.clientX - rect.left

    const y =
        e.clientY - rect.top

    const normalizedX =
        (x / rect.width - 0.5) * 2

    const normalizedY =
        (y / rect.height - 0.5) * 2

    heroRef.current.style.setProperty(
        '--mouse-x',
        `${x}px`,
    )

    heroRef.current.style.setProperty(
        '--mouse-y',
        `${y}px`,
    )

    // The spheres move only a few pixels while their highlight moves more,
    // so the background feels dimensional without becoming distracting.
    heroRef.current.style.setProperty(
        '--orb1-x',
        `${normalizedX * -12}px`,
    )
    heroRef.current.style.setProperty(
        '--orb1-y',
        `${normalizedY * -9}px`,
    )
    heroRef.current.style.setProperty(
        '--orb2-x',
        `${normalizedX * 15}px`,
    )
    heroRef.current.style.setProperty(
        '--orb2-y',
        `${normalizedY * 11}px`,
    )
    heroRef.current.style.setProperty(
        '--orb3-x',
        `${normalizedX * -8}px`,
    )
    heroRef.current.style.setProperty(
        '--orb3-y',
        `${normalizedY * 7}px`,
    )

    heroRef.current.style.setProperty(
        '--sphere-light-x',
        `${34 + normalizedX * 10}%`,
    )
    heroRef.current.style.setProperty(
        '--sphere-light-y',
        `${28 + normalizedY * 9}%`,
    )
  }

  const handleHeroMouseLeave = () => {
    if (!heroRef.current) {
      return
    }

    heroRef.current.style.setProperty('--orb1-x', '0px')
    heroRef.current.style.setProperty('--orb1-y', '0px')
    heroRef.current.style.setProperty('--orb2-x', '0px')
    heroRef.current.style.setProperty('--orb2-y', '0px')
    heroRef.current.style.setProperty('--orb3-x', '0px')
    heroRef.current.style.setProperty('--orb3-y', '0px')
    heroRef.current.style.setProperty('--sphere-light-x', '34%')
    heroRef.current.style.setProperty('--sphere-light-y', '28%')
  }

  const handleMouseMove = (

      e: MouseEvent<HTMLElement>,
  ) => {
    if (cursorRef.current) {
      cursorRef.current.style.transform =
          `translate3d(${e.clientX}px, ${e.clientY}px, 0)`
    }

    if (
        previewRef.current &&
        activeProject
    ) {
      const previewWidth = 360
      const previewHeight = 250

      let x =
          e.clientX + 26

      let y =
          e.clientY + 22

      if (
          x + previewWidth >
          window.innerWidth - 20
      ) {
        x =
            e.clientX -
            previewWidth -
            26
      }

      if (
          y + previewHeight >
          window.innerHeight - 20
      ) {
        y =
            e.clientY -
            previewHeight -
            22
      }

      previewRef.current.style.transform =
          `translate3d(${x}px, ${y}px, 0)`
    }
  }

  return (
      <main
          className="portfolio"
          onMouseMove={
            handleMouseMove
          }
      >
        {/* ================= HERO ================= */}

        <section
            ref={heroRef}
            className="hero"
            onMouseMove={
              handleHeroMouseMove
            }
            onMouseLeave={
              handleHeroMouseLeave
            }
        >
          <div className="hero-depth">
            <div className="hero-depth-circle circle-one" />
            <div className="hero-depth-circle circle-two" />
            <div className="hero-depth-circle circle-three" />
          </div>

          <div className="hero-mouse-light" />

          <header className="header">
            <button
                type="button"
                onClick={() => {
                  document
                      .querySelector(
                          '#about',
                      )
                      ?.scrollIntoView({
                        behavior:
                            'smooth',
                      })
                }}
            >
              ABOUT
            </button>

            <span>
            ©2026, PARK SUJI
          </span>

            <button
                type="button"
                onClick={() => {
                  document
                      .querySelector(
                          '#contact',
                      )
                      ?.scrollIntoView({
                        behavior:
                            'smooth',
                      })
                }}
            >
              CONTACT
            </button>
          </header>

          <div className="hero-content">
            <div className="hero-kicker">
            <span>
              BACKEND ENGINEERING
            </span>

              <span>
              KOREA
            </span>
            </div>

            <div className="hero-title-wrap">
              <h1>
                BACKEND
              </h1>

              <h1>
                DEVELOPER
              </h1>
            </div>

            <div className="hero-bottom">
            <span className="scroll-mark">
              ↓
            </span>

              <div className="hero-description">
                <p className="hero-description-main">
                  Backend developer
                  focused on
                  <br />
                  building reliable
                  systems.
                </p>

                <p className="hero-description-sub">
                  Java, Spring Boot,
                  Redis, Kafka,
                  <br />
                  MySQL and Docker.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= PROJECTS ================= */}

        <section className="projects">
          <div className="projects-heading">
            <div className="reveal-wrapper">
              <h2 className="reveal">
                SELECTED
                <br />
                PROJECTS
              </h2>
            </div>
          </div>

          <div className="project-list">
            {projects.map(
                (
                    project,
                    index,
                ) => (
                    <button
                        type="button"
                        key={
                          project.id
                        }
                        className={`project-item reveal reveal-delay-${
                            index + 1
                        }`}
                        style={
                          {
                            '--project-color':
                            project.color,
                          } as CSSProperties
                        }
                        onMouseEnter={() =>
                            setActiveProject(
                                project,
                            )
                        }
                        onMouseLeave={() =>
                            setActiveProject(
                                null,
                            )
                        }
                        onClick={() =>
                            navigate(
                                `/projects/${project.slug}`,
                            )
                        }
                    >
                <span className="project-number">
                  {project.id}
                </span>

                      <div className="project-main">
                        <h3>
                          {project.name}
                        </h3>

                        <span className="project-subtitle">
                    {
                      project.subtitle
                    }
                  </span>
                      </div>

                      <div className="project-right">
                  <span>
                    {
                      project.type
                    }
                  </span>

                        <span>
                    ↗
                  </span>
                      </div>
                    </button>
                ),
            )}
          </div>
        </section>

        {/* ================= ABOUT ================= */}

        <section
            id="about"
            className="content-section light-section"
        >
        <span className="section-label reveal">
          ABOUT
        </span>

          <div className="reveal-wrapper">
            <h2 className="macro-title reveal">
              BUILD.
              <br />
              IMPROVE.
              <br />
              SOLVE.
            </h2>
          </div>

          <div className="about-copy reveal">
            <p>
              안정적인 백엔드 구조를
              고민하고,
              실제 문제를 코드로
              해결하는 개발자입니다.
            </p>

            <p>
              기능 구현에서 끝나지 않고
              동시성, 비동기 처리,
              성능 테스트와 실제 배포까지
              경험해 왔습니다.
            </p>
          </div>
        </section>

        {/* ================= STACK ================= */}

        <section className="content-section dark-section">
        <span className="section-label reveal">
          STACK
        </span>

          <div className="reveal-wrapper">
            <h2 className="macro-title reveal">
              JAVA
              <br />
              SPRING
              <br />
              REDIS
              <br />
              KAFKA
            </h2>
          </div>

          <div className="stack-bottom reveal">
          <span>
            MYSQL
          </span>

            <span>
            DOCKER
          </span>

            <span>
            AWS
          </span>

            <span>
            REACT
          </span>
          </div>
        </section>

        {/* ================= CONTACT ================= */}

        <section
            id="contact"
            className="content-section contact-section"
        >
        <span className="section-label reveal">
          CONTACT
        </span>

          <div className="reveal-wrapper">
            <h2 className="macro-title reveal">
              LET'S
              <br />
              CONNECT.
            </h2>
          </div>

          <div className="contact-bottom reveal">
            <a
                href="https://github.com/e0321e-sudo"
                target="_blank"
                rel="noreferrer"
            >
              GITHUB
            </a>

            <a href="mailto:brun0@naver.com">
              brun0@naver.com
            </a>

            <a href="tel:01063179996">
              010-6317-9996
            </a>
          </div>
        </section>

        {/* ================= CURSOR ================= */}

        <div
            ref={cursorRef}
            className="custom-cursor"
        />

        {/* ================= PROJECT HOVER PREVIEW ================= */}

        <div
            ref={previewRef}
            className={`project-preview ${
                activeProject
                    ? 'visible'
                    : ''
            }`}
        >
          {activeProject && (
              <div
                  className="preview-card"
                  style={
                    {
                      '--preview-color':
                      activeProject.color,
                    } as CSSProperties
                  }
              >
                <div className="preview-media">
                  {activeProject.mediaType ===
                  'video' ? (
                      <video
                          key={
                            activeProject.media
                          }
                          src={
                            activeProject.media
                          }
                          autoPlay
                          muted
                          loop
                          playsInline
                      />
                  ) : (
                      <img
                          src={
                            activeProject.media
                          }
                          alt={`${activeProject.name} preview`}
                      />
                  )}
                </div>

                <div className="preview-info">
              <span>
                {
                  activeProject.id
                }
              </span>

                  <span>
                {
                  activeProject.name
                }
              </span>

                  <span>
                {
                  activeProject.type
                }
              </span>
                </div>
              </div>
          )}
        </div>
      </main>
  )
}

/* =========================================================
   PROJECT DETAIL
========================================================= */

function ProjectDetail() {
  const navigate =
      useNavigate()

  const { slug } =
      useParams()

  const project =
      projects.find(
          (item) =>
              item.slug === slug,
      )

  const demoRef =
      useRef<HTMLElement>(
          null,
      )

  useEffect(() => {
    window.scrollTo(
        0,
        0,
    )

    const targets =
        document.querySelectorAll(
            '.detail-reveal',
        )

    const observer =
        new IntersectionObserver(
            (entries) => {
              entries.forEach(
                  (entry) => {
                    if (
                        entry.isIntersecting
                    ) {
                      entry.target.classList.add(
                          'visible',
                      )
                    }
                  },
              )
            },
            {
              threshold: 0.08,
            },
        )

    targets.forEach(
        (target) =>
            observer.observe(
                target,
            ),
    )

    return () =>
        observer.disconnect()
  }, [slug])

  if (!project) {
    return (
        <main className="not-found">
          <h1>
            PROJECT NOT FOUND
          </h1>

          <button
              type="button"
              onClick={() =>
                  navigate('/')
              }
          >
            BACK TO HOME
          </button>
        </main>
    )
  }

  const openUrl = (
      url?: string,
  ) => {
    if (!url) return

    window.open(
        url,
        '_blank',
        'noopener,noreferrer',
    )
  }

  return (
      <main
          className="detail-page"
          style={
            {
              '--detail-color':
              project.color,
            } as CSSProperties
          }
      >
        {/* ================= HEADER ================= */}

        <header className="detail-header">
          <button
              type="button"
              onClick={() =>
                  navigate('/')
              }
          >
            ← BACK
          </button>

          <span>
          PARK SUJI /
          PORTFOLIO
        </span>

          <span>
          {project.type}
        </span>
        </header>

        {/* ================= HERO ================= */}

        <section className="detail-hero">
          <div className="detail-depth-circle detail-circle-one" />
          <div className="detail-depth-circle detail-circle-two" />

          <div className="detail-hero-content">
            <div className="detail-meta">
            <span>
              {project.period}
            </span>

              <span>
              {project.role}
            </span>
            </div>

            <h1>
              {project.name}
            </h1>

            <div className="detail-intro">
              <p className="detail-subtitle">
                {
                  project.subtitle
                }
              </p>

              <p className="detail-overview">
                {
                  project.overview
                }
              </p>
            </div>
          </div>
        </section>

        {/* ================= DEMO ================= */}

        <section
            ref={demoRef}
            className="detail-media-section"
        >
          <div className="detail-media detail-reveal">
            {project.mediaType ===
            'video' ? (
                <video
                    src={
                      project.media
                    }
                    autoPlay
                    muted
                    loop
                    playsInline
                    controls
                />
            ) : (
                <img
                    src={
                      project.media
                    }
                    alt={
                      project.name
                    }
                />
            )}
          </div>
        </section>

        {/* ================= INFO ================= */}

        <section className="detail-info-grid detail-reveal">
          <div>
          <span className="detail-small-label">
            TYPE
          </span>

            <strong>
              {project.type}
            </strong>
          </div>

          <div>
          <span className="detail-small-label">
            ROLE
          </span>

            <strong>
              {project.role}
            </strong>
          </div>

          <div>
          <span className="detail-small-label">
            PERIOD
          </span>

            <strong>
              {project.period}
            </strong>
          </div>
        </section>

        {/* ================= STACK ================= */}

        <section className="detail-stack-section detail-reveal">
        <span className="detail-small-label">
          TECH STACK
        </span>

          <div className="detail-stack">
            {project.stack.map(
                (tech) => (
                    <span key={tech}>
                {tech}
              </span>
                ),
            )}
          </div>
        </section>

        {/* ================= CONTENT ================= */}

        <section className="detail-content">
          {project.sections.map(
              (
                  section,
                  index,
              ) => (
                  <article
                      key={
                        section.title
                      }
                      className="detail-content-row detail-reveal"
                  >
              <span className="detail-content-number">
                {String(
                    index + 1,
                ).padStart(
                    2,
                    '0',
                )}
              </span>

                    <h2>
                      {
                        section.title
                      }
                    </h2>

                    <p>
                      {section.body}
                    </p>
                  </article>
              ),
          )}
        </section>

        {/* ================= EARTHY GALLERY ================= */}

        {project.gallery &&
            project.gallery.length >
            0 && (
                <section className="detail-gallery">
                  <div className="detail-gallery-heading detail-reveal">
              <span className="detail-small-label">
                PROJECT SCREENS
              </span>

                    <h2>
                      SELECTED
                      <br />
                      SCREENS.
                    </h2>
                  </div>

                  <div className="detail-gallery-list">
                    {project.gallery.map(
                        (
                            image,
                            index,
                        ) => (
                            <figure
                                key={
                                  image.src
                                }
                                className={`detail-gallery-item ${
                                    image.type ??
                                    'wide'
                                } detail-reveal`}
                            >
                              <div className="detail-gallery-meta">
                      <span>
                        {String(
                            index +
                            1,
                        ).padStart(
                            2,
                            '0',
                        )}
                      </span>

                                <span>
                        {
                          image.caption
                        }
                      </span>
                              </div>

                              <div className="detail-gallery-image">
                                <img
                                    src={
                                      image.src
                                    }
                                    alt={
                                      image.alt
                                    }
                                    loading="lazy"
                                />
                              </div>
                            </figure>
                        ),
                    )}
                  </div>
                </section>
            )}

        {/* ================= REDIS7 QA ================= */}

        {project.testCaseImage && (
            <section className="detail-testcase-section">
              <div className="detail-testcase-header detail-reveal">
            <span className="detail-small-label">
              QA DOCUMENT
            </span>

                <h2>
                  BROWSER
                  <br />
                  TEST CASE.
                </h2>

                <p>
                  기능별 정상·예외
                  시나리오를 기준으로
                  브라우저 테스트
                  케이스를 작성하고
                  PASS / FAIL / FIX
                  상태를 관리했습니다.
                  1차 테스트 → 수정 후
                  2차 테스트 → 배포
                  환경 테스트까지 총
                  3회 검증했습니다.
                </p>
              </div>

              <div className="detail-testcase-image detail-reveal">
                <img
                    src={
                      project.testCaseImage
                    }
                    alt={`${project.name} browser test case`}
                />
              </div>

              {project.testCaseLink && (
                  <a
                      className="detail-testcase-link detail-reveal"
                      href={
                        project.testCaseLink
                      }
                      target="_blank"
                      rel="noreferrer"
                  >
                    VIEW TEST CASE
                    ↗
                  </a>
              )}
            </section>
        )}

        {/* ================= END ================= */}

        <section
            className="detail-end"
            style={{
              backgroundColor:
              project.color,
            }}
        >
        <span>
          PROJECT LINKS
        </span>

          <h2>
            VIEW
            <br />
            PROJECT.
          </h2>

          <div className="detail-end-links">
            {project.liveSite && (
                <button
                    type="button"
                    onClick={() =>
                        openUrl(
                            project.liveSite,
                        )
                    }
                >
                  LIVE SITE ↗
                </button>
            )}

            {project.github && (
                <button
                    type="button"
                    onClick={() =>
                        openUrl(
                            project.github,
                        )
                    }
                >
                  GITHUB ↗
                </button>
            )}

            {project.performance && (
                <button
                    type="button"
                    onClick={() =>
                        openUrl(
                            project.performance,
                        )
                    }
                >
                  LOAD TEST ↗
                </button>
            )}

            {project.testCaseLink && (
                <button
                    type="button"
                    onClick={() =>
                        openUrl(
                            project.testCaseLink,
                        )
                    }
                >
                  TEST CASE ↗
                </button>
            )}

            <button
                type="button"
                onClick={() =>
                    demoRef.current?.scrollIntoView(
                        {
                          behavior:
                              'smooth',
                        },
                    )
                }
            >
              DEMO ↑
            </button>
          </div>
        </section>

        <footer className="detail-footer">
          <button
              type="button"
              onClick={() =>
                  navigate('/')
              }
          >
            ← BACK TO
            PROJECTS
          </button>

          <span>
          ©2026 PARK SUJI
        </span>
        </footer>
      </main>
  )
}

export default App