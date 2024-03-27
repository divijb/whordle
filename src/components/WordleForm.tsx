import React, { useState } from "react";
import styled from "styled-components";

import Button from "./Button";
import Input from "./Input";
import Form, {FormProps} from "./Form";
import FormElement from "./FormElement";
import dictionary from "../data/dictionary";

const StyledForm = styled(Form)`
  margin: 25px 30px;
  width: 100vw;
  min-width: 1024px;
`;

const StyledLetterInputContainer = styled.div`
  display: flex;
`;

const StyledLetterInput = styled(Input)`
  width: 32px;
  margin-right: 5px;
`;

const StyledInputSmall = styled(Input)`
  width: 64px;
  margin-right: 5px;
`;

const StyledActions = styled.div`
  display: flex;
  justify-content: flex-start;
  padding-left: 232px;
  > button {
    margin-right: 25px;
  }
`;

const StyledWordsContainer = styled.div`
padding: 40px;
`;

type TFormFields = {
  excludedLetters?: string;
  includeLetters?: string;
  antiPatternLetter1?: string;
  antiPatternLetter2?: string;
  antiPatternLetter3?: string;
  antiPatternLetter4?: string;
  antiPatternLetter5?: string;
  patternLetter1?: string;
  patternLetter2?: string;
  patternLetter3?: string;
  patternLetter4?: string;
  patternLetter5?: string;
}

interface IWordFilters {
  dict: string[],
  letters: (string | undefined)[] | undefined
}

const WordleForm = () => {
  const [form] = Form.useForm();
  const [filteredWords, setFilteredWords] = useState<string[]>([]);
  const handleSearch: FormProps<TFormFields>["onFinish"] = (values: TFormFields) => {
    const includedLetters = values?.includeLetters?.split('');
    const excludedLetters = values?.excludedLetters?.split('');
    const exactWord = [values.patternLetter1, values.patternLetter2, values.patternLetter3, values.patternLetter4, values.patternLetter5];
    const antiWord = [values.antiPatternLetter1, values.antiPatternLetter2, values.antiPatternLetter3, values.antiPatternLetter4, values.antiPatternLetter5];

    let predictions = [...dictionary];

    const filterWithExactLetters = ({ dict, letters }: IWordFilters): string[] => {
      if (!letters?.length) {
        return dict;
      }

      return dict.filter(w => {
        const allMatch: boolean[] = [];
        letters.forEach((letter, index) => {
          if (!!letter) {
            allMatch[index] = w[index] === letter;
          }
        });

        return allMatch.every(isTrue => isTrue);

      });
    };

    const filterWithLettersNotInExactSpace = ({ dict, letters: lettersList }: IWordFilters): string[] => {

      if (!lettersList?.length) {
        return dict;
      }

      return dict.filter(w => {
        const allMatch: boolean[] = [];
        lettersList.forEach((letters, index) => {
          if (!!letters?.length) {
            // barby
            // a,r
            allMatch[index] = letters.includes(w[index]);
          }
        });

        return allMatch.every(isTrue => !isTrue);

      });

    };

    const filterWithExcludedLetters = ({ dict, letters }: IWordFilters): string[] => letters?.length ? dict.filter(w => w.split('').every(l => !letters.includes(l))) : dict;

    const filterWithIncludedLetters = ({ dict, letters }: IWordFilters): string[] => letters?.length
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      ? dict.filter(w => letters.every(l => w.includes(l!)))
      : dict;


    console.log('>> initial: ', predictions.length);
    // 1. Filter with exact letters
    predictions = filterWithExactLetters({dict: predictions, letters: exactWord});
    console.log('>> after include Exact : ', predictions.length);
    // 2. Filter out any words with these letters in their exact space
    predictions = filterWithLettersNotInExactSpace({dict: predictions, letters: antiWord});
    console.log('>> after exclude Exact : ', predictions.length);
    // 3. Filter out any words with these letters
    predictions = filterWithExcludedLetters({dict: predictions, letters: excludedLetters});
    console.log('>> after excluding letters : ', predictions.length);
    // 4. Filter words that have these letters
    predictions = filterWithIncludedLetters({dict: predictions, letters: includedLetters});
    console.log('>> after including letters : ', predictions.length);
    setFilteredWords(predictions);
  };

  const handleReset = () => form.resetFields();

  return (
    <>
      <StyledForm form={form} name="Wordle Help" onFinish={(fields) => handleSearch(fields as TFormFields)}>
        <FormElement label="Included Letters">
          <Form.Item name="includeLetters" initialValue="abc">
            <Input placeholder="Letters in the word" maxLength={25} />
          </Form.Item>
        </FormElement>
        <FormElement label="Excluded Letters">
          <Form.Item name="excludedLetters" initialValue="def">
            <Input placeholder="Letters not in the word" maxLength={25} />
          </Form.Item>
        </FormElement>
        <FormElement label="Word Pattern (e.g. - d?v?j)">
          <StyledLetterInputContainer>
            <Form.Item name="patternLetter1">
              <StyledLetterInput placeholder="d" maxLength={1} />
            </Form.Item>
            <Form.Item name="patternLetter2">
              <StyledLetterInput placeholder="i" maxLength={1} />
            </Form.Item>
            <Form.Item name="patternLetter3">
              <StyledLetterInput placeholder="v" maxLength={1} />
            </Form.Item>
            <Form.Item name="patternLetter4">
              <StyledLetterInput placeholder="i" maxLength={1} />
            </Form.Item>
            <Form.Item name="patternLetter5">
              <StyledLetterInput placeholder="j" maxLength={1} />
            </Form.Item>
          </StyledLetterInputContainer>
        </FormElement>
        <FormElement
          label={
            <span>
            Word Anti Pattern <br />
            (Enter letters that DO NOT belong in that position)
            </span>
          }
        >
          <StyledLetterInputContainer>
            <Form.Item name="antiPatternLetter1">
              <StyledInputSmall placeholder="bab" maxLength={15} />
            </Form.Item>
            <Form.Item name="antiPatternLetter2">
              <StyledInputSmall placeholder="ba" maxLength={15} />
            </Form.Item>
            <Form.Item name="antiPatternLetter3">
              <StyledInputSmall placeholder="aba" maxLength={15} />
            </Form.Item>
            <Form.Item name="antiPatternLetter4">
              <StyledInputSmall placeholder="bo" maxLength={15} />
            </Form.Item>
            <Form.Item name="antiPatternLetter5">
              <StyledInputSmall placeholder="boo" maxLength={15} />
            </Form.Item>
          </StyledLetterInputContainer>
        </FormElement>
        <Form.Item>
          <StyledActions>
            <Button onClick={handleReset}>Reset</Button>
            <Button type="primary" htmlType="submit">
            Search!
            </Button>
          </StyledActions>
        </Form.Item>
      </StyledForm>
      <StyledWordsContainer>
        <h2>Possible words ({filteredWords.length} words)</h2>
        <div>
          {
            filteredWords.join(', ')
          }
        </div>
      </StyledWordsContainer>
    </>
  );
};

export default WordleForm;
