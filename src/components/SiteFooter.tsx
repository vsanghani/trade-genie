export function SiteFooter() {
    return (
        <footer
            style={{
                textAlign: 'center',
                padding: '3rem',
                borderTop: '1px solid var(--border-color)',
                color: 'var(--text-secondary)',
                fontSize: '0.875rem',
            }}
        >
            <p>&copy; {new Date().getFullYear()} TradeGenie. All rights reserved.</p>
        </footer>
    );
}
