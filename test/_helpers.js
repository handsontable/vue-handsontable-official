export function wait(amount, body, resolveFunc) {
  if (!resolveFunc) {
    resolveFunc = body;
    body = ()=>{};
  }
  return new Promise((resolve, reject) => {
    body();
    setTimeout(() => {
      resolve();
    }, amount);
  }).then(resolveFunc);
}