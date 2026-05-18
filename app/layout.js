export const metadata = {
  title: "CSCP Study App",
  description: "CSCP Study System"
};

export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
