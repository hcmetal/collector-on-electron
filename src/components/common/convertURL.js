export default function convertURL(text) {
  const exp1 = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;

  let text1 = text.replace(exp1, '<a target="_blank" href="$1">$1</a>');

  const exp2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;

  const text2 = text1.replace(
    exp2,
    '$1<a target="_blank" href="http://$2">$2</a>'
  );

  return { __html: text2 + "<br />" };
}
