import nltk  # See http://www.nltk.org for documentation and instillation details


def getTemporalReference(text):
    """
    Assign temporal reference (past, present, or future) to verbs and verb 
    modifiers from English text. This script first uses the Natural Language 
    Toolkit (NLTK) to classify each word in a text to a part-of-speech (POS). 
    Based on the POS assignment from NLTK, for any word classified as a verb, 
    the preceding context is considered to correctly assign the verb (and any 
    modifiers) a temporal reference.
    
    DEPENDENCIES: This script requires the NLTK package (written using version 3.4.1).
    
    DISCLAIMER: Temporal reference may be interpreted in many ways. This is simply
    our interpretation. This implementation is designed to be easy to read and 
    understand, but is NOT optimized for efficiency. This should really be viewed 
    as readable pseudo-code that runs.
    
    INPUT:
        text == A sentence (string) to be classified
    
    OUTPUT:
        tempRef == The temporal reference assignments of each word of the input 
                   sentence, as a list of tuples.
        tags == The part-of-speech tags assigned to each word, as determined by
                   NLTK's POS tagger, as a list of tuples.
    
    COPYRIGHT: Lindsay M. Ross and Laurence A. Clarfeld, Department of Computer 
    Science, University of Vermont
    
    LAST MODIFIED: 11/12/19
    
    You are free to use or modify this code for research purposes, as long as you 
    reference the website where you obtained the code.
    
    IF YOU PUBLISH ANYTHING USING THIS CODE OR ALGORITHM, PLEASE REFERENCE THE 
    FOLLOWING THESIS AND PAPER:
        
    Ross, L.M., Danforth C.M., Eppstein M.J., Clarfeld, L.A., Durieux, B.N., 
    Gramling, C.J., Hirsch, L., Rizzo, D.M., Gramling, R. (2019).  Story Arcs 
    in Serious Illness: Natural Language Processing features of Palliative Care 
    Conversations. Patient education and counseling. (in press)
    """

    # NLTK part-of-speech codes:
    # MD    modal, (could/will)
    # VB	    verb, base form	(take)
    # VBD	verb, past tense	 (took)
    # VBG	verb, gerund/present participle	(taking)
    # VBN	verb, past participle (taken)
    # VBP	verb, sing. present, non-3d	(take)
    # VBZ	verb, 3rd person sing. present (takes)

    # Labels for each temporal category
    NON_VERB = 0  # Including "modifiers"
    PAST = 1
    PRESENT = 2
    FUTURE = 3
    VERB_AMBIGUOUS = 4

    text = nltk.word_tokenize(text)  # tokenize text
    tags = nltk.pos_tag(text)  # Get POS tags via NLTK
    tempRef = []

    # Tag temporal reference for each verb
    for i in range(len(tags)):
        try:
            if tags[i][1] == 'VB':
                # future, infinitive, future imperative
                if (tags[i - 1][1] == 'MD' or
                        tags[i - 1][0] == 'to' or
                        tags[i - 1][0] == "let's" or
                        (tags[i - 2][0] == "let" and tags[i - 1][0] == "us")):
                    tempRef.append((tags[i][0], FUTURE))
                # present simple (AMBIGUOUS, PRESENT OR FUTURE)
                # In this case, there is no systematic was to assign reference
                else:
                    tempRef.append((tags[i][0], VERB_AMBIGUOUS))
            elif tags[i][1] == 'VBD':
                # past simple/prereterite
                tempRef.append((tags[i][0], PAST))
            elif tags[i][1] == 'VBG':
                # future perfect continuous
                if (tags[i - 3][0] == 'will' and
                        tags[i - 2][0] == 'have' and
                        tags[i - 1][0] == 'been'):
                    tempRef.append((tags[i][0], FUTURE))
                # present continuous
                elif (tags[i - 1][0] == "am" or
                      tags[i - 1][0] == "are" or
                      tags[i - 1][0] == "is"):
                    tempRef.append((tags[i][0], PRESENT))
                # past continuous
                elif (tags[i - 1][0] == "was" or
                      tags[i - 1][0] == "were"):
                    tempRef.append((tags[i][0], PAST))
                # future continuous
                elif (tags[i - 2][1] == 'MD' and
                      tags[i - 1][0] == 'be'):
                    tempRef.append((tags[i][0], FUTURE))
                # present perfect continuous 
                elif ((tags[i - 2][0] == "has" or tags[i - 2][0] == "have") and
                      tags[i - 1][0] == "been"):
                    tempRef.append((tags[i][0], PRESENT))
                # past perfect continuous
                elif (tags[i - 2][0] == "had" and
                      tags[i - 1][0] == "been"):
                    tempRef.append((tags[i][0], PAST))
                # present participle
                else:
                    tempRef.append((tags[i][0], PRESENT))
            elif tags[i][1] == 'VBN':
                # future perfect 
                if (tags[i - 2][0] == "will" and
                        tags[i - 1][0] == "have"):
                    tempRef.append((tags[i][0], FUTURE))
                # present perfect, past perfect, perfect participle
                else:
                    tempRef.append((tags[i][0], PAST))
            # present simple
            elif tags[i][1] == 'VBP':
                tempRef.append((tags[i][0], PRESENT))

            elif tags[i][1] == 'VBZ':
                tempRef.append((tags[i][0], PRESENT))
            else:
                tempRef.append((tags[i][0], NON_VERB))
        except IndexError:
            print(tags[i][0], "not categorized, truncated information")

    return tempRef, tags
