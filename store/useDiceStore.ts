import { create } from 'zustand';

import { MathUtils } from '@/utils/helpers/math';

interface DiceStore {
  rolling: boolean;
  notation: string;
  backdropVisible: boolean;
  setRolling: (rolling: boolean) => void;
  setNotation: (notation: string) => void;
  setBackdropVisible: (visible: boolean) => void;
  getNumberOfFaces: () => number;
}

export const useDiceStore = create<DiceStore>((set, get) => ({
  rolling: false,
  notation: '',
  backdropVisible: false,

  /**
   * Whether the user is rolling a dice
   * @param rolling - Whether the user is rolling a dice
   */
  setRolling: (rolling: boolean) => set(() => ({ rolling })),

  /**
   * Set the dice notation to be used
   * @param notation - The dice notation
   */
  setNotation: (notation: string) => set(() => ({ notation })),

  /**
   * Set backdrop visibility
   * @param visible - Whether the backdrop is visible
   */
  setBackdropVisible: (visible: boolean) => set(() => ({ backdropVisible: visible })),

  /**
   * Get the number of dice faces from the most recent dice notation
   * @returns The number of dice faces
   */
  getNumberOfFaces() {
    const arr = /^([0-9]*)d([0-9]+|%)/.exec(get().notation);
    let numberOfFaces = 20;
    if (arr && arr[2]) numberOfFaces = MathUtils.toNumber(arr[2]);
    return numberOfFaces;
  },
}));
