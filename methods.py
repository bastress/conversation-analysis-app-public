import assemblyai as aai
import json
import nltk

from VCL_Temporal_Reference_Tagger import getTemporalReference


#TODO INPUT ASSEMBLY AI KEY HERE:
AAI_API_KEY = ""


def annotate_sentence(sentence):
    """
    Takes sentence and returns tuple with sentence and assigned tense (PAST, PRESENT, FUTURE, or AMBIGUOUS)

    :param sentence: sentence string
    :return: tuples containing sentence and tense
    """
    # Get temporal references and tags for the sentence
    temp_ref, tags = getTemporalReference(sentence)

    # Initialize a dictionary to count occurrences of each tense
    tense_count = {1: 0, 2: 0, 3: 0, 4: 0}  # 1: PAST, 2: PRESENT, 3: FUTURE, 4: AMBIGUOUS

    # Count the number of each tense based on verb classifications
    for word, tense in temp_ref:
        if tense in tense_count:
            tense_count[tense] += 1

    # Determine the dominant tense in the sentence
    if tense_count[1] == tense_count[2] == tense_count[3]:
        tense_label = "PRESENT"
    else:
        dominant_tense = max(tense_count, key=tense_count.get)
        if dominant_tense == 1:
            tense_label = "PAST"
        elif dominant_tense == 2:
            tense_label = "PRESENT"
        elif dominant_tense == 3:
            tense_label = "FUTURE"
        else:
            tense_label = "AMBIGUOUS"

    # Store the result
    return sentence, tense_label


def annotate_text(text):
    """
    Takes text and returns list with sentences and their assigned tense (PAST, PRESENT, FUTURE, or AMBIGUOUS)

    :param text: string of text
    :return: list of tuples containing sentence and tense
    """
    sentence_list = nltk.tokenize.sent_tokenize(text)

    annotated_sentences = []

    for s in sentence_list:
        annotated_sentences.append(annotate_sentence(s))

    return annotated_sentences


def generate_transcript(audio_file):
    aai.settings.api_key = AAI_API_KEY

    config = aai.TranscriptionConfig(sentiment_analysis=True, speaker_labels=True)

    print("PROCESSING AUDIO FILE:")
    print("Generating AAI transcript object")

    transcriber = aai.Transcriber()
    transcript = transcriber.transcribe(audio_file, config=config)

    print("AAI transcript generated")

    return transcript


def transcript_to_dict_object(transcript):
    print("Parsing and formatting data")
    processed_transcript = {
        "tense_stats": {"PAST": 0, "PRESENT": 0, "FUTURE": 0, "AMBIGUOUS": 0},
        "utterances": []
    }

    total_sentences = len(transcript.sentiment_analysis)
    cur_speaker = transcript.sentiment_analysis[0].speaker
    text = ""
    sentences = []
    line_num = 0
    num_speakers = 1
    speakers = {}
    speaker_id = 1

    for j, sentence in enumerate(transcript.sentiment_analysis):

        print(f"SPEAKER: {sentence.speaker}")

        # Case: new speaker or last sentence
        if sentence.speaker != cur_speaker or j == total_sentences - 1:

            # Case: last sentence has same speaker
            if sentence.speaker == cur_speaker:
                text += ' ' + sentence.text
                sentences.append({
                    "sentiment": sentence.sentiment.value,
                    "start_time": sentence.start,
                    "end_time": sentence.end
                })

            line_num += 1
            processed_sentences = []
            annotated_sentences = annotate_text(text)
            s_num = 0

            # Process sentences for utterance
            for i, (s, tense) in enumerate(annotated_sentences):
                # Track tense count
                processed_transcript['tense_stats'][tense] += 1
                # Append sentence
                s_num += 1
                processed_sentences.append({
                    "sentence_number": s_num,
                    "sentence": s,
                    "tense": tense,
                    "sentiment": sentences[i]["sentiment"],
                    "start_time": sentences[i]["start_time"],
                    "end_time": sentences[i]["end_time"]
                })

            # Create utterance
            processed_transcript["utterances"].append({
                "line": line_num,
                "speaker_id": speaker_id,
                "sentences": processed_sentences
            })

            # Set new current speaker, clear sentences and text
            cur_speaker = sentence.speaker
            text = ""
            sentences = []

        # Regardless of speaker, extend text and append sentence
        text += ' ' + sentence.text
        sentences.append({
            "sentiment": sentence.sentiment.value,
            "start_time": sentence.start,
            "end_time": sentence.end
        })

        # Speaker data
        name = 'Speaker ' + sentence.speaker
        exists = False

        for id_key, speaker in speakers.items():
            if speaker['name'] == name:
                exists = True
                speaker_id = id_key
        if not exists:
            speaker_id = num_speakers
            speakers[speaker_id] = {'name': name}
            num_speakers += 1

    # Case: last two sentences had different speakers
    if transcript.sentiment_analysis[-1].speaker != transcript.sentiment_analysis[-2].speaker:
        last_sentence = transcript.sentiment_analysis[-1]
        processed_transcript["utterances"].append({
            "line": line_num + 1,
            "speaker_id": speaker_id,
            "sentences": [{
                "sentence_number": 1,
                "sentence": last_sentence.text,
                "tense": annotate_sentence(last_sentence.text)[1],
                "sentiment": last_sentence.sentiment,
                "start_time": last_sentence.start,
                "end_time": last_sentence.end
            }]
        })

    # Set speakers after loop
    processed_transcript['speakers'] = speakers
    print("*****SPEAKERS:")
    print(speakers)

    # Convert counts to percentages
    if total_sentences > 0:
        for tense in processed_transcript['tense_stats']:
            processed_transcript['tense_stats'][tense] = (processed_transcript['tense_stats'][
                                                                  tense] / total_sentences) * 100

    print("PROCESSING COMPLETE")
    return processed_transcript


"""
# OUTDATED METHOD, left for reference

# Speaker transcription didn't align with another 

def transcript_to_dict_object_old(transcript):

    processed_transcript = {
        "tense_stats": {"PAST": 0, "PRESENT": 0, "FUTURE": 0, "AMBIGUOUS": 0},
        "utterances": []
    }
    total_sentences = 0
    line_num = 0
    num_speakers = 1
    speakers = {}

    for utterance in transcript.utterances:

        # Speaker data
        name = 'Speaker ' + utterance.speaker
        exists = False

        for id_key, speaker in speakers.items():
            if speaker['name'] == name:
                exists = True
                speaker_id = id_key
        if not exists:
            speaker_id = num_speakers
            speakers[speaker_id] = {'name': name}
            num_speakers += 1

        processed_transcript['speakers'] = speakers
        print("*****SPEAKERS:")
        print(speakers)

        # Sentence and tense processing
        line_num += 1
        processed_sentences = []
        annotated_sentences = annotate_text(utterance.text)
        s_num = 0
        for sentence, tense in annotated_sentences:
            # Track tense count
            processed_transcript['tense_stats'][tense] += 1
            total_sentences += 1
            # Append sentence
            s_num += 1
            processed_sentences.append({
                "sentence_number": s_num,
                "sentence": sentence,
                "tense": tense
            })

        # Append speaker line
        processed_transcript["utterances"].append({
            "line": line_num,
            "speaker_id": speaker_id,
            "sentences": processed_sentences
        })

    # Add sentiment analysis and timestamps to sentences
    sentiments = transcript.sentiment_analysis
    print("SENTIMENTS LENGTH: " + str(len(sentiments)))
    s_count = 0
    for u_index in range(len(processed_transcript["utterances"])):
        for s_index in range(len(processed_transcript["utterances"][u_index]["sentences"])):
            sentence_obj = processed_transcript["utterances"][u_index]["sentences"][s_index]
            sentence_obj["start_time"] = sentiments[s_count].start / 1000
            sentence_obj["end_time"] = sentiments[s_count].end / 1000
            sentence_obj["sentiment"] = sentiments[s_count].sentiment.value
            s_count += 1

    # Convert counts to percentages
    if total_sentences > 0:
        for tense in processed_transcript['tense_stats']:
            processed_transcript['tense_stats'][tense] = (processed_transcript['tense_stats'][
                                                              tense] / total_sentences) * 100

    return processed_transcript
"""

def transcript_to_json(transcript_dict_object, filename):
    with open(filename, 'w') as file:
        json.dump(transcript_dict_object, file, indent=4)
