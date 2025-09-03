import { Typography } from "@material-tailwind/react";

const Footer = () => (
  <footer className=" mt-4 text-center">
    <Typography className="text-gray-900 text-xl font-semibold">
      If you find this web app useful, give a star to the repo!
    </Typography>
    <a
      href="https://github.com/chiragkpoojary/frontend-note"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center mt-3 bg-gray-900 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
    >
      <svg
        aria-hidden="true"
        className="mr-2"
        height="16"
        viewBox="0 0 16 16"
        version="1.1"
        width="16"
        fill="currentColor"
      >
        <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.13 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.11.16 1.93.08 2.13.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
      </svg>
      Star on GitHub
    </a>
  </footer>
);

export default Footer;
