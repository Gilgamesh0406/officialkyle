const formatExportData = (data: any, error?: boolean) => ({
  error: error,
  data: data,
  message: error ? data.error : 'Success',
  success: !error,
});

export default function onMessageSocket(m: any) {
  switch (m.type) {
    case 'first':
    case 'info':
    case 'success':
    case 'balance':
    case 'modal':
    case 'online':
    case 'list':
    case 'alerts':
    case 'notifies':
    case 'reload':
    case 'refresh':
    case 'coinflip':
    case 'level':
    case 'unboxing':
    case 'casebattle':
    case 'plinko':
    case 'rewards':
    case 'chat':
    case 'offers':
    case 'rain':
    case 'dashboard':
    case 'pagination':
    case 'dailycases':
    case 'casecreator':
    case 'profile':
    case 'inventory':
    case 'gamebots':
      return formatExportData(m);
    case 'error':
      return formatExportData(m, true);
    default:
      console.log('==> [SOCK] Unknown type:', m.type);
      return {
        error: true,
        data: m,
        message: 'Unknown type: ' + m.type,
        success: false,
      };
  }
}
