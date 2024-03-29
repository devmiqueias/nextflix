import { useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import {
  FaGithub,
  FaLinkedinIn,
  FaWhatsapp,
  FaRegEnvelope
} from 'react-icons/fa'
import { MdClose } from 'react-icons/md'
import { useMediaQuery } from '../../hooks'
import { navData } from './navData'
import { handleKeyPress } from './keyboard.utils'
import * as S from './styles'

interface SideMenuProps {
  isMenuOpen: boolean
  closeMenu: () => void
}

export const SideMenu = ({ isMenuOpen, closeMenu }: SideMenuProps) => {
  const buttonCloseRef = useRef<HTMLButtonElement>(null)
  const buttonWhatsappRef = useRef<HTMLAnchorElement>(null)
  const firstLinkRef = useRef<HTMLAnchorElement>(null)
  const { query } = useRouter()
  const greaterThan1025 = useMediaQuery('(min-width: 1025px)')

  useEffect(() => {
    const fireKeyPress = (e: KeyboardEvent) =>
      handleKeyPress(e, closeMenu, buttonWhatsappRef, buttonCloseRef)
    !greaterThan1025 && isMenuOpen && firstLinkRef.current?.focus()
    !greaterThan1025 && document.addEventListener('keydown', fireKeyPress)
    !greaterThan1025
      ? (document.body.style.overflow = 'hidden')
      : (document.body.style.overflow = 'auto')
    return () => {
      document.removeEventListener('keydown', fireKeyPress)
      document.body.style.overflow = 'auto'
    }
  }, [isMenuOpen, closeMenu, greaterThan1025])

  return (
    <>
      <S.Overlay
        className={isMenuOpen ? 'isOpen' : ''}
        onClick={closeMenu}
        data-testid="ovelay-background"
      />
      <S.Container
        aria-label="main"
        aria-hidden={!greaterThan1025 && !isMenuOpen}
        className={isMenuOpen || greaterThan1025 ? 'isOpen' : ''}
      >
        <S.Header>
          <S.Logo aria-hidden="true">
            Next<span>Flix</span>
          </S.Logo>
          <S.CloseBtn
            type="button"
            aria-label="close navigation"
            aria-hidden={greaterThan1025}
            onClick={closeMenu}
            ref={buttonCloseRef}
          >
            <MdClose fontSize="25" aria-hidden="true" />
          </S.CloseBtn>
        </S.Header>
        <S.NavItems>
          {navData.map((item, index) => (
            <S.ItemLink
              key={'navitem' + item.name + item.path}
              className={query.network === item.networkId ? 'selected' : ''}
              onClick={closeMenu}
            >
              <Link
                href={item.path}
                aria-current={
                  query.network === item.networkId ? 'page' : undefined
                }
                ref={index === 0 ? firstLinkRef : null}
              >
                <Image
                  src={`/assets/logos/small${item.networkId}.png`}
                  width={25}
                  height={25}
                  alt=""
                />
                {item.name}
              </Link>
            </S.ItemLink>
          ))}
        </S.NavItems>
        <S.Footer>
          <ul>
            <S.SocialListItem>
              <Link
                href="mailto:devmiqueias@gmail.com"
                aria-label="dev miqueias email"
              >
                <FaRegEnvelope fontSize="20" aria-hidden="true" />
              </Link>
            </S.SocialListItem>
            <S.SocialListItem>
              <Link
                href="https://github.com/devmiqueias/nextflix"
                aria-label="dev miqueias github"
              >
                <FaGithub fontSize="20" aria-hidden="true" />
              </Link>
            </S.SocialListItem>
            <S.SocialListItem>
              <Link
                href="https://www.linkedin.com/in/devmiqueias/"
                aria-label="dev miqueias linkedin"
              >
                <FaLinkedinIn fontSize="20" aria-hidden="true" />
              </Link>
            </S.SocialListItem>
            <S.SocialListItem>
              <Link
                href="https://wa.me/5548991652816"
                aria-label="dev miqueias whatsapp"
                ref={buttonWhatsappRef}
              >
                <FaWhatsapp fontSize="20" aria-hidden="true" />
              </Link>
            </S.SocialListItem>
          </ul>
        </S.Footer>
      </S.Container>
    </>
  )
}
