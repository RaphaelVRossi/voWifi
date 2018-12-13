export function generateError(error: any) {
  if (typeof error == 'string')
    return JSON.stringify(error);
  else if (error.error && typeof error.error == 'string')
    generateError(error.error);
  else if (error.error && error.error instanceof ProgressEvent)
    return 'Servidor fora do ar';
  else {
    console.log(JSON.stringify(error));
    return 'Erro interno';
  }
}

export function consoleLogSqlSuccess(sql: any, data: any) {
  console.log(`SQL [${sql}] data [${data ? JSON.stringify(data) : ''}] OK`);
}

export function consoleLogSqlError(sql: any, data: any, error: any) {
  console.log(`Error SQL [${sql}] data [${data ? JSON.stringify(data) : ''}] error [${JSON.stringify(error)}]`);
}

export function prepareXmlData(xml: any) {
  return xml
    .replace(/[\n\s]+(\<[^/])/g, '')
    .replace(/(\\<\/[a-zA-Z0-9-_\\.:]+\\>)[\\s]/g, '')
    .replace(/(\/\\>)[\\s]+/g, '')
    .replace(/<\/([a-z0-9]+?:)(.*?)>/g, '<$2>')
    .replace(/<([a-z0-9]+?:)(.*?)>/g, '<$2>');
}

export function getXmlValueFromStatusTag(xml) {
  let regExpExecArray = /<Status>(.+)<\/Status>/g.exec(xml);

  if (!regExpExecArray || regExpExecArray.length == 0)
    return '';

  return regExpExecArray[0].replace(/<Status>/g, '').replace(/<\/Status>/g, '');
}

export function getXmlValueFromStatusMessageTag(xml) {
  let regExpExecArray = /<StatusMessage>(.+)<\/StatusMessage>/g.exec(xml);

  if (!regExpExecArray || regExpExecArray.length == 0)
    return '';

  return regExpExecArray[0].replace(/<StatusMessage>/g, '').replace(/<\/StatusMessage>/g, '');
}
