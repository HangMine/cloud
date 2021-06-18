export type Unpromise<P> = P extends PromiseLike<infer K> ? K : P;
