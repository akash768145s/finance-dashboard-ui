export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="dash-footer">
      <div className="dash-footer__brand">
        <div className="dash-footer__strip">
          <p className="dash-footer__text">
            <span className="dash-footer__meta">
              <span className="dash-footer__mark" aria-hidden="true">
                ©
              </span>
              <time className="dash-footer__year" dateTime={String(year)}>
                {year}
              </time>
              <span className="dash-footer__entity">
                <span className="dash-footer__name">Zorvyn</span>
                <span className="dash-footer__suffix">Fintech</span>
              </span>
            </span>
            <span className="dash-footer__rule" aria-hidden="true" />
            <span className="dash-footer__legal">All rights reserved.</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
