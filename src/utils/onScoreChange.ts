import { isEmpty } from 'lodash';

// Держать значение для minScore и maxScore в пределах min-max
export const onScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (isEmpty(e.target.value)) return;

  const min = e.target.min;
  const max = e.target.max;
  const value = e.target.value;

  if (+value < +min) {
    e.target.value = min;
  } else if (+value > +max) {
    e.target.value = max;
  } else if (!/^\d*\.?\d{0,2}$/.test(value)) {
    e.target.value = value.match(/^\d*\.?\d{0,2}/)?.[0] ?? '';
  }
};
