export function renderTemplate(template: string, data: Record<PropertyKey, unknown>): string {
  return template.replace(/{{(.*?)}}/g, (match) => {
    return String(data[match.split(/{{|}}/).filter(Boolean)[0]]);
  });
}
export default renderTemplate;
