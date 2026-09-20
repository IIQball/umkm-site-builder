import type { ComponentType } from 'svelte';

export interface CategoryFilter {
  name: string;
  icon: ComponentType | null;
}

export interface Kecamatan {
  name: string;
}

export interface UmkmItem {
  name: string;
  category: string;
  kecamatan: string;
  desc: string;
  count: string;
  rating: string;
  distance: string;
}

export interface BuilderStep {
  n: string;
  icon: ComponentType;
  label: string;
  title: string;
  desc: string;
}

export interface BuilderProduct {
  name: string;
  price: string;
}

export interface FeaturedItem {
  name: string;
  loc: string;
  tag: string;
  rate: string;
}

export interface HowItWorksStep {
  n: string;
  t: string;
  d: string;
}
