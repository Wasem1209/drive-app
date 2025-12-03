// src/utils/lucid.ts
import { Lucid, Blockfrost } from "lucid-cardano";

export const getLucid = () => {
    return Lucid.new(
        new Blockfrost(
            "https://cardano-preprod.blockfrost.io/api/v0",
            process.env.BLOCKFROST_KEY!
        ),
        "Preprod"
    );
};
