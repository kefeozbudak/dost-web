import fs from 'fs';
let pb = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

// I need to find the mangled code:
/*
                        })()}
                        </ul>
                      )}

                      {item.buttonText !== "" && (
                        <div
                          className={`font-label-md text-label-md ${isPrimary ? "text-primary" : "text-secondary"} group-hover:translate-x-2 transition-transform flex items-center gap-1`}
                        >
*/

const badCode = /\}\)\(\)\}\s*<\/ul>\s*\)\}\s*\{item\.buttonText !== "" && \(\s*<div\s+className=\{`font-label-md text-label-md \$\{isPrimary \? "text-primary" : "text-secondary"\} group-hover:translate-x-2 transition-transform flex items-center gap-1`\}\s*>/;

// Wait, I should just fix the bento_academic card closing and high_school closing manually because they are completely messed up.

