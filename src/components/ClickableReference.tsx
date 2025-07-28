import Link from "next/link";
import { FC } from "react";

export const ClickableReference: FC<{ refId: number; references: any[] }> = ({ refId, references }) => {
    const reference = references.find(ref => ref.ref_id === refId);
    
    if (!reference) return null;

    return (
        <Link
            href={reference.reference_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-xs text-black hover:text-white px-2 py-[2px] mx-1 rounded-md cursor-pointer hover:bg-black transition-colors"
        >
            {refId}
        </Link>
    );
};
