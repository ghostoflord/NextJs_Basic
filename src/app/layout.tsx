import AppFooter from '@/components/footer/app.footer';
import ThemeRegistry from '@/components/theme-registry/theme.registry';
import NextAuthWrapper from '@/lib/next.auth.wrapper';
import { TrackContextProvider } from '@/lib/track.wrapper';
import { ToastProvider } from '@/utils/toast';
import NProgressWrapper from '@/lib/nprogress.wrapper';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <ThemeRegistry>
                    <NProgressWrapper>
                        <NextAuthWrapper>
                            <ToastProvider>
                                <TrackContextProvider>
                                    {children}
                                </TrackContextProvider>
                            </ToastProvider>
                        </NextAuthWrapper>
                    </NProgressWrapper>
                </ThemeRegistry>
            </body>
        </html>
    );
}