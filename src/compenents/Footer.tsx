function Footer() {
  return (
    <footer className="bg-white border-t py-4 px-6 text-sm text-center text-gray-500">
      © {new Date().getFullYear()}{" "}
      <span className="font-semibold text-indigo-600">Intelebee</span>. All rights reserved.
    </footer>
  );
}

export default Footer;
