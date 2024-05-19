export const metadata = {
  title: 'BrainGainz',
  description: 'Gainz in your brains, and in your veins',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
