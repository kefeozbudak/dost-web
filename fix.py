import sys

with open('src/components/PageBlocks.tsx', 'r') as f:
    content = f.read()

bad_snippet = """                                  >
                                    check_circle           case "high_school_hero":          return (            <HighSchoolHeroBlock              key={index}              block={block}              getStyle={getStyle}              getTitleStyle={getTitleStyle}              getSubtitleStyle={getSubtitleStyle}            />          );                  case "high_school_programs":          return (            <HighSchoolProgramsBlock              key={index}              block={block}              getStyle={getStyle}              getTitleStyle={getTitleStyle}              getSubtitleStyle={getSubtitleStyle}            />          );sition-colors whitespace-pre-line`}                            style={isPrimary ? { color: "#D4AF37" } : {}}                          >"""

good_snippet = """                                  >
                                    check_circle
                                  </span>
                                </div>
                                <span className="font-body-md text-body-md whitespace-pre-line">
                                  {listItem}
                                </span>
                              </li>
                            )
                          );
                        })()}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </section>
          );

        case "high_school_hero":
          return (
            <HighSchoolHeroBlock
              key={index}
              block={block}
              getStyle={getStyle}
              getTitleStyle={getTitleStyle}
              getSubtitleStyle={getSubtitleStyle}
            />
          );
          
        case "high_school_programs":
          return (
            <HighSchoolProgramsBlock
              key={index}
              block={block}
              getStyle={getStyle}
              getTitleStyle={getTitleStyle}
              getSubtitleStyle={getSubtitleStyle}
            />
          );
"""

if bad_snippet in content:
    content = content.replace(bad_snippet, good_snippet)
    with open('src/components/PageBlocks.tsx', 'w') as f:
        f.write(content)
    print("Fixed!")
else:
    print("Not found. Searching for similar...")
    idx = content.find("check_circle           case")
    if idx != -1:
        print("Found at", idx)
        # We need to extract the exact bad snippet from the file
        bad_snippet_actual = content[idx-150 : idx+500]
        print(bad_snippet_actual)
