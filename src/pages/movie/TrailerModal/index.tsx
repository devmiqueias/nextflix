import { useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { MdClose } from 'react-icons/md'
import { useQueryMovieTrailer } from '../../../querys'
import { Loader } from '../../../components/Loader'
import { NotFound } from '../../../components/NotFound'
import * as S from './styles'

interface TrailerModalProps {
  visibility: boolean
  setTrailerVisibility: (value: boolean) => void
}

export const TrailerModal = ({
  visibility,
  setTrailerVisibility
}: TrailerModalProps) => {
  const router = useRouter()
  const { t } = useTranslation('common')
  const trailerModalRef = useRef<HTMLDivElement>(null)
  const buttonCloseRef = useRef<HTMLButtonElement>(null)
  const trailerIframeRef = useRef<HTMLIFrameElement>(null)
  const { data, isLoading } = useQueryMovieTrailer(
    router.query.movie as string,
    router.locale!
  )

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        setTrailerVisibility(false)
      }
      if (e.key === 'Tab') {
        e.preventDefault()
        if (e.target === buttonCloseRef.current) {
          trailerIframeRef.current?.focus()
        } else {
          buttonCloseRef.current?.focus()
        }
      }
    }
    trailerModalRef.current?.focus()
    document.addEventListener('keydown', handleKeyPress)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyPress)
      document.body.style.overflow = 'auto'
    }
  }, [setTrailerVisibility])

  return ReactDOM.createPortal(
    <>
      <S.Overlay
        className={visibility ? 'visibility' : ''}
        onClick={() => setTrailerVisibility(false)}
      />
      <S.Container
        role="dialog"
        aria-label="trailer"
        aria-modal="true"
        ref={trailerModalRef}
        className={visibility ? 'visibility' : ''}
      >
        <S.CloseButton
          onClick={() => setTrailerVisibility(false)}
          aria-label="close"
          ref={buttonCloseRef}
        >
          <MdClose fontSize="30px" aria-hidden="true" />
        </S.CloseButton>
        {!isLoading && !data?.key && (
          <NotFound tag="h3" description={t('trailer_modal.dont_found')} />
        )}
        {isLoading && <Loader />}
        {data?.key && (
          <iframe
            width="560"
            height="315"
            src={`https://www.youtube.com/embed/${data.key}`}
            title="YouTube video player"
            allow="accelerometer;
                    autoplay;
                    gyroscope;
                    clipboard-write;
                    encrypted-media;
                    picture-in-picture;"
            allowFullScreen
            ref={trailerIframeRef}
          ></iframe>
        )}
      </S.Container>
    </>,
    document.body
  )
}
