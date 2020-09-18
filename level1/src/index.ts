export async function main() {}

if (require.main === module) {
  main()
    .then(() => console.info('done'))
    .catch((error) => console.error('failed', error));
}
