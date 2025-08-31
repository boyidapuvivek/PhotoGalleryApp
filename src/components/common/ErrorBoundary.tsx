import React, { Component, ErrorInfo, ReactNode } from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { THEME } from "@/utils/constants"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <View style={styles.container}>
          <Ionicons
            name='warning-outline'
            size={80}
            color={THEME.COLORS.ERROR}
            style={styles.icon}
          />
          <Text style={styles.title}>Oops! Something went wrong</Text>
          <Text style={styles.message}>
            {this.state.error?.message || "An unexpected error occurred"}
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={this.handleRetry}>
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      )
    }

    return this.props.children
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: THEME.SPACING.XL,
    backgroundColor: THEME.COLORS.LIGHT.BACKGROUND,
  },
  icon: {
    marginBottom: THEME.SPACING.LG,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: THEME.SPACING.SM,
    color: THEME.COLORS.LIGHT.TEXT_PRIMARY,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: THEME.SPACING.XL,
    color: THEME.COLORS.LIGHT.TEXT_SECONDARY,
  },
  button: {
    backgroundColor: THEME.COLORS.PRIMARY,
    paddingHorizontal: THEME.SPACING.LG,
    paddingVertical: THEME.SPACING.MD,
    borderRadius: THEME.BORDER_RADIUS.SM,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
})
