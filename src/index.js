import { TipLink } from "@tiplink/api";

const createTipLink = async () => {
  console.log("======Creating a TipLink======");
  try {
    const tiplink = await TipLink.create();
    console.log("link: ", tiplink.url.toString());
    console.log("publicKey: ", tiplink.keypair.publicKey.toBase58());
    return tiplink;
  } catch (error) {
    console.error("Error creating TipLink:", error);
  }
};

const getKeypairFromLink = async (tp) => {
  console.log("======Getting a keypair from a TipLink link======");
  try {
    const tiplink = await TipLink.fromLink(tp);
    console.log("link: ", tp);
    console.log("converted publicKey: ", tiplink.keypair.publicKey.toBase58());
    return tiplink;
  } catch (error) {
    console.error("Error getting keypair from link:", error);
  }
};

const main = async () => {
  await createTipLink();
  const tp = "https://tiplink.io/i#5jC3aFcBJR4g4BQ5D";
  await getKeypairFromLink(tp);
};

main();
