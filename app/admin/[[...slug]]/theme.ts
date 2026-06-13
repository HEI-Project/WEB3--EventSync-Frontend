import { createTheme } from '@mui/material/styles';

export const adminTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#22d3ee',
      light: '#67e8f9',
      dark: '#0891b2',
      contrastText: '#0a0e1a',
    },
    secondary: {
      main: '#a78bfa',
      light: '#c4b5fd',
      dark: '#7c3aed',
    },
    background: {
      default: '#080c18',
      paper: '#0f1322',
    },
    text: {
      primary: '#e2e8f0',
      secondary: '#8896b0',
      disabled: '#475569',
    },
    divider: 'rgba(148, 163, 184, 0.08)',
    error: {
      main: '#f87171',
    },
    warning: {
      main: '#fbbf24',
    },
    success: {
      main: '#34d399',
    },
    info: {
      main: '#22d3ee',
    },
  },
  typography: {
    fontFamily: '"Geist", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h6: {
      fontWeight: 500,
      fontSize: '0.95rem',
      letterSpacing: '-0.01em',
    },
    body2: {
      fontSize: '0.8125rem',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      letterSpacing: '0.02em',
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    RaLayout: {
      styleOverrides: {
        root: {
          '& .RaLayout-content': {
            background: '#080c18 !important',
          },
          '& .RaLayout-appFrame': {
            marginLeft: 0,
          },
        },
      },
    },
    RaSidebar: {
      styleOverrides: {
        root: {
          '& .RaSidebar-fixed': {
            background: '#0f1322',
            borderRight: '1px solid rgba(148, 163, 184, 0.08)',
          },
        },
      },
    },
    RaMenu: {
      styleOverrides: {
        root: {
          '& .RaMenu-item': {
            borderRadius: 8,
            margin: '2px 8px',
            transition: 'all 150ms cubic-bezier(0.23, 1, 0.32, 1)',
          },
          '& .MuiListItemIcon-root': {
            minWidth: 36,
          },
        },
      },
    },
    RaList: {
      styleOverrides: {
        root: {
          position: 'relative',
          '& .RaList-content': {
            background: 'transparent',
            boxShadow: 'none',
            border: '1px solid rgba(148, 163, 184, 0.08)',
            borderRadius: 12,
          },
          '& .RaList-header': {
            padding: '16px 24px',
            borderBottom: '1px solid rgba(148, 163, 184, 0.08)',
            background: '#0f1322',
          },
          '& .RaList-actions': {
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          },
        },
      },
    },
    RaDatagrid: {
      styleOverrides: {
        root: {
          position: 'relative',
          '& .RaDatagrid-headerRow th': {
            background: '#0f1322',
            fontWeight: 600,
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: '#8896b0',
            padding: '12px 16px',
            borderBottom: '1px solid rgba(148, 163, 184, 0.08)',
          },
          '& .RaDatagrid-row': {
            transition: 'background 120ms ease-out',
          },
          '& .RaDatagrid-row:hover': {
            background: 'rgba(34, 211, 238, 0.04)',
          },
          '& .RaDatagrid-row:not(:last-child) td': {
            borderBottom: '1px solid rgba(148, 163, 184, 0.04)',
          },
          '& .RaDatagrid-dataRow td': {
            padding: '10px 16px',
            fontSize: '0.8125rem',
          },
          '& .RaDatagrid-empty': {
            padding: '48px 16px',
            color: '#8896b0',
          },
        },
      },
    },
    RaBulkActionsToolbar: {
      styleOverrides: {
        root: {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: '#0f1322 !important',
          borderBottom: '1px solid rgba(34, 211, 238, 0.2)',
          padding: '8px 16px',
          minHeight: 44,
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
          animation: 'slideDown 150ms ease-out',
          '@keyframes slideDown': {
            from: { opacity: 0, transform: 'translateY(-4px)' },
            to: { opacity: 1, transform: 'translateY(0)' },
          },
        },
      },
    },
    RaCreate: {
      styleOverrides: {
        root: {
          '& .RaCreate-card': {
            background: '#0f1322',
            border: '1px solid rgba(148, 163, 184, 0.08)',
            borderRadius: 12,
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          },
          '& .RaCreate-header': {
            padding: '20px 24px 0',
          },
        },
      },
    },
    RaEdit: {
      styleOverrides: {
        root: {
          '& .RaEdit-card': {
            background: '#0f1322',
            border: '1px solid rgba(148, 163, 184, 0.08)',
            borderRadius: 12,
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          },
          '& .RaEdit-header': {
            padding: '20px 24px 0',
          },
        },
      },
    },
    RaShow: {
      styleOverrides: {
        root: {
          '& .RaShow-card': {
            background: '#0f1322',
            border: '1px solid rgba(148, 163, 184, 0.08)',
            borderRadius: 12,
          },
        },
      },
    },
    RaToolbar: {
      styleOverrides: {
        root: {
          background: '#0f1322',
          borderTop: '1px solid rgba(148, 163, 184, 0.08)',
          padding: '12px 24px',
        },
      },
    },
    RaSimpleFormIterator: {
      defaultProps: {
        fullWidth: true,
      },
    },
    RaTranslatableInputs: {
      defaultProps: {
        fullWidth: true,
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: '#0f1322',
          border: '1px solid rgba(148, 163, 184, 0.08)',
          borderRadius: 12,
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: '#0f1322',
          borderRight: '1px solid rgba(148, 163, 184, 0.08)',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            fontWeight: 600,
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: '#8896b0',
            background: '#0f1322',
            borderBottom: '1px solid rgba(148, 163, 184, 0.08)',
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: 'background 120ms ease-out',
          '&:hover': {
            background: 'rgba(34, 211, 238, 0.04)',
          },
          '&:last-child td': {
            borderBottom: 'none',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '10px 16px',
          fontSize: '0.8125rem',
          borderBottom: '1px solid rgba(148, 163, 184, 0.04)',
          color: '#e2e8f0',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.8125rem',
          borderRadius: 8,
          padding: '6px 16px',
          transition: 'all 150ms cubic-bezier(0.23, 1, 0.32, 1)',
          '&:active': {
            transform: 'scale(0.97)',
          },
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(34, 211, 238, 0.2)',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: 'all 150ms cubic-bezier(0.23, 1, 0.32, 1)',
          '&:active': {
            transform: 'scale(0.92)',
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontSize: '0.8125rem',
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          background: 'rgba(148, 163, 184, 0.06)',
          '&:hover': {
            background: 'rgba(148, 163, 184, 0.1)',
          },
          '&.Mui-focused': {
            background: 'rgba(148, 163, 184, 0.08)',
            boxShadow: '0 0 0 2px rgba(34, 211, 238, 0.2)',
          },
        },
        input: {
          padding: '10px 12px 8px',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '0.8125rem',
          color: '#8896b0',
          '&.Mui-focused': {
            color: '#22d3ee',
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontSize: '0.75rem',
          fontWeight: 500,
        },
        outlined: {
          borderColor: 'rgba(148, 163, 184, 0.2)',
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          background: '#0f1322',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: '#0f1322 !important',
          borderBottom: '1px solid rgba(148, 163, 184, 0.08)',
          boxShadow: 'none',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 2,
          borderRadius: '2px 2px 0 0',
          background: '#22d3ee',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.8125rem',
          minHeight: 44,
        },
      },
    },
    MuiBreadcrumbs: {
      styleOverrides: {
        li: {
          fontSize: '0.8125rem',
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: '#22d3ee',
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          fontSize: 20,
        },
      },
    },
  },
});
