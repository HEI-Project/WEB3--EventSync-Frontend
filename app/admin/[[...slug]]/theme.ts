import { defaultTheme } from 'react-admin';

export const adminTheme = {
  ...defaultTheme,
  palette: {
    mode: 'dark' as const,
    primary: {
      main: '#22d3ee',
    },
    secondary: {
      main: '#a78bfa',
    },
    background: {
      default: '#0f172a',
      paper: '#1e293b',
    },
    text: {
      primary: '#f1f5f9',
      secondary: '#94a3b8',
    },
    error: {
      main: '#f87171',
    },
  },
  components: {
    ...defaultTheme.components,
    RaLayout: {
      styleOverrides: {
        root: {
          '& .RaLayout-content': {
            background: '#0f172a',
          },
        },
      },
    },
    RaList: {
      styleOverrides: {
        root: {
          background: '#1e293b',
        },
      },
    },
  },
};
