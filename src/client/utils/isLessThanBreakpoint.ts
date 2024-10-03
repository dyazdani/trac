const BREAKPOINTS: string[]  = ["base", "sm", "md", "lg", "xl", "2xl"]

const isLessThanBreakpoint = (firstBreakpoint: string, secondBreakpoint: string) => {
   return BREAKPOINTS.findIndex(el => el === firstBreakpoint) < BREAKPOINTS.findIndex(el => el === secondBreakpoint)
}

export default isLessThanBreakpoint;