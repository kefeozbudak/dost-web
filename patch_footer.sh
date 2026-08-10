#!/bin/bash
sed -i 's/<SmartLink /<SmartLink onClick={(e) => { if (link.label.includes("KVKK")) { e.preventDefault(); openKvkkModal(); } }} /g' src/components/Footer.tsx
sed -i '4i import { openKvkkModal } from "./KvkkModal";' src/components/Footer.tsx
